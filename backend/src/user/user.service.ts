/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ethers } from 'ethers';
import IskoChainCredentialABI from '../../abis/IskoChainCredential.json'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async bindWallet(
    walletAddress: string,
    studentId?: string,
    role: string = 'student',
    email?: string,
    firstName?: string,
    middleName?: string,
    lastName?: string,
    yearLevel?: number,
    programId?: number
  ) {
    return this.prisma.user.upsert({
      where: { walletAddress: walletAddress.toLowerCase() }, // lowercase for safety!
      update: { studentId, role, email, yearLevel, programId },
      create: { walletAddress: walletAddress.toLowerCase(), studentId, role, email, firstName, middleName, lastName, yearLevel, programId },
    });
  }


  async addAdminUnified(walletAddress: string, email: string) {
    walletAddress = ethers.getAddress(walletAddress); // Checksummed (throws if invalid)

    // 1. Add to database first (upsert ensures no duplicate)
    let user;
    try {
      user = await this.prisma.user.upsert({
        where: { walletAddress },
        update: { role: 'admin', email },
        create: { walletAddress: walletAddress.toLowerCase(), role: 'admin', email },
      });
    } catch (err) {
      throw new BadRequestException('Failed to create admin in database: ' + err.message);
    }

    // 2. Grant on-chain admin role
    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY!;
      const signer = new ethers.Wallet(adminPrivateKey, provider);

      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS!,
        IskoChainCredentialABI,
        signer
      );

      // 2a. Check: Does signer have DEFAULT_ADMIN_ROLE?
      const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      const hasAdminRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, signer.address);
      if (!hasAdminRole) {
        throw new Error(
          `Configured admin signer (${signer.address}) does not have DEFAULT_ADMIN_ROLE.`
        );
      }

      // 2b. Check: Is user already an on-chain admin? (Optional, prevents duplicate tx)
      const isAlreadyAdmin = await contract.hasRole(await contract.ADMIN_ROLE(), walletAddress);
      if (isAlreadyAdmin) {
        return {
          success: true,
          alreadyOnChain: true,
          user: { id: user.id, walletAddress, email, role: user.role },
          message: 'Admin already has on-chain ADMIN_ROLE. Only database was updated.',
        };
      }

      // 2c. Grant admin role on-chain
      const tx = await contract.addAdmin(walletAddress);
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
        user: { id: user.id, walletAddress, email, role: user.role },
        message: 'Admin added to both DB and smart contract.',
      };
    } catch (err: any) {
      // Roll back DB addition if chain grant fails (optional but recommended)
      await this.prisma.user.delete({ where: { walletAddress } });

      // Print full error to logs for devops
      console.error('[addAdminUnified] Error:', err);

      throw new BadRequestException(
        'Failed to grant admin on chain: ' +
          (err.reason || err.message || JSON.stringify(err))
      );
    }
  }

  async getRole(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase()}
    });
    return { role: user?.role || null };
  }


  async findByWallet(walletAddress: string) {
    return this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
  }

  async findByStudentId(studentId: string) {
    return this.prisma.user.findUnique({
      where: { studentId },
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
        yearLevel: true,
        program: {         
          select: {
            id: true,
            name: true,
            abbreviation: true
          }
        }
      },
    });
  }


  async getUsers({ role, search, page, pageSize, programId }) {
    // Example using Prisma ORM
    const where: any = { role };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search } },
        { walletAddress: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role === 'student' && programId) {
      where.programId = programId;
    }
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { program: true }, // include program relation for students
        orderBy: { id: 'desc' }
      }),
      this.prisma.user.count({ where }),
    ]);
    return { users, total };
  }

  async updateUser(id: number, body: any) {
    // Only update allowed fields based on role!
    // body: { email? ...student fields? }
    return this.prisma.user.update({
      where: { id },
      data: body,
    });
  }

  async deleteUser(id: number) {
    // Could use soft delete if you want
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async isSuperadmin(walletAddress: string): Promise<boolean> {
    if (!walletAddress) return false;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      IskoChainCredentialABI,
      provider
    );
    // Get the DEFAULT_ADMIN_ROLE bytes32 value
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    // Check if the walletAddress has this role
    return await contract.hasRole(DEFAULT_ADMIN_ROLE, walletAddress);
  }
}
