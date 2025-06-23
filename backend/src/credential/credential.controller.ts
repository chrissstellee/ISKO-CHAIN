/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { ethers } from 'ethers';
import IskoChainCredentialABI from '../../abis/IskoChainCredential.json';
const PinataClient = require('@pinata/sdk');



// Then instantiate as usual:
const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_API_SECRET,
});

// Helper: Generate unique credential code based on type, details, year, etc.
function generateCredentialCode(credentialType: string, credentialDetails: string) {
  function getPrefix(type: string) {
    switch (type) {
      case "Degree Certificate": return "DIP";
      case "Course Completion": return "COMP";
      case "Honor/Award": return "HONOR";
      case "Workshop Certificate": return "WS";
      case "Transcript": return "TRANS";
      default: return "CRED";
    }
  }
  const prefix = getPrefix(credentialType);
  const year = new Date().getFullYear();
  // For completion/workshop, you could use an abbreviation of the details (optional)
  let detailShort = "";
  if (credentialType === "Course Completion" || credentialType === "Workshop Certificate") {
    detailShort = "-" + (credentialDetails?.split(" ").map(w => w[0]).join("").toUpperCase() || "");
  }
  // Simple random for demo; for production, use DB sequence/UUID or a strict counter.
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${detailShort}-${year}-${randomPart}`;
}

@Controller('credentials')
export class CredentialController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('issue')
  async issueCredential(@Body() body: any) {
    const {
      credentialType,
      studentId,
      credentialDetails,
      issueDate,
      issuer,
      additionalInfo,
      firstName,
      middleName,
      lastName,
      yearLevel,
      programName,
    } = body;

    // 1. Lookup student (by studentId)
    const user = await this.prisma.user.findUnique({
      where: { studentId },
      include: { program: true }, // include program if needed
    });
    if (!user || !user.walletAddress)
      throw new BadRequestException('Student not found or missing wallet.');

    // 2. Generate credential code
    const credentialCode = generateCredentialCode(credentialType, credentialDetails);

    // 3. Prepare metadata for IPFS (all fields)
    const credentialMetadata = {
      credentialCode,
      credentialType,
      credentialDetails,
      studentId,
      issueDate,
      issuer,
      firstName: firstName ?? user?.firstName ?? null,
      middleName: middleName ?? user?.middleName ?? null,
      lastName: lastName ?? user?.lastName ?? null,
      yearLevel: yearLevel ?? user?.yearLevel ?? null,
      program: programName ?? user?.program?.name ?? null,
      additionalInfo,
    };

    // 4. Pin to Pinata
    const pinRes = await pinata.pinJSONToIPFS(credentialMetadata, {
      pinataMetadata: { name: `Credential-${studentId}-${credentialCode}` },
    });
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${pinRes.IpfsHash}`;

    // 5. Return everything needed for minting
    return {
      credentialCode,
      tokenURI,
      walletAddress: user.walletAddress,
    };
  }

  @Post('revoke')
  async revokeCredential(@Body() body: { tokenId: number, reason: string }) {
    const { tokenId, reason } = body;

    if (!tokenId || !reason) throw new BadRequestException('Token ID and reason required');

    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY!;
      const signer = new ethers.Wallet(adminPrivateKey, provider);
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS!,
        IskoChainCredentialABI,
        signer
      );
      // Call contract function
      const tx = await contract.revokeCredential(tokenId, reason);
      await tx.wait();

      return { success: true, txHash: tx.hash, message: 'Credential revoked' };
    } catch (err: any) {
      throw new BadRequestException('Failed to revoke on chain: ' + (err.reason || err.message));
    }
  }

  @Post('reissue')
  async reissueCredential(@Body() body: any) {
    // Required: oldTokenId, credentialType, credentialDetails, issueDate, additionalInfo, etc.
    const {
      oldTokenId,
      credentialType,
      credentialDetails,
      issueDate,
      issuer,
      additionalInfo,
      firstName,
      middleName,
      lastName,
      yearLevel,
      programName,
      studentId,
      reason,
    } = body;

    // 1. Lookup student wallet by studentId
    let user: (User & { program: { name: string; id: number; createdAt: Date; abbreviation: string } | null }) | null = null;
    if (studentId) {
      user = await this.prisma.user.findUnique({
        where: { studentId },
        include: { program: true },
      });
    }

    if (!user || !user.walletAddress)
      throw new BadRequestException('Student not found or missing wallet.');

    // 2. Generate new credential code
    const credentialCode = generateCredentialCode(credentialType, credentialDetails);

    // 3. Pin updated metadata to IPFS
    const credentialMetadata = {
      credentialCode,
      credentialType,
      credentialDetails,
      studentId,
      issueDate,
      issuer,
      firstName: firstName ?? user.firstName,
      middleName: middleName ?? user.middleName,
      lastName: lastName ?? user.lastName,
      yearLevel: yearLevel ?? user.yearLevel,
      program: programName ?? user.program?.name ?? null,
      additionalInfo,
    };
    const pinRes = await pinata.pinJSONToIPFS(credentialMetadata, {
      pinataMetadata: { name: `Credential-${studentId}-${credentialCode}` },
    });
    const newTokenURI = `https://gateway.pinata.cloud/ipfs/${pinRes.IpfsHash}`;

    // 4. Call smart contract to revoke & reissue
    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY!;
      const signer = new ethers.Wallet(adminPrivateKey, provider);
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS!,
        IskoChainCredentialABI,
        signer
      );

      // Chain: reissueCredential(oldTokenId, newOwner, newTokenURI, reason)
      const tx = await contract.reissueCredential(
        oldTokenId,
        user.walletAddress,
        newTokenURI,
        reason || 'Reissued'
      );
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        newTokenURI,
        credentialCode,
        message: 'Credential reissued',
      };
    } catch (err: any) {
      throw new BadRequestException('Failed to reissue on chain: ' + (err.reason || err.message));
    }
  }

}
