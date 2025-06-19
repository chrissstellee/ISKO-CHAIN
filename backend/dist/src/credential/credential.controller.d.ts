import { PrismaService } from 'prisma/prisma.service';
export declare class CredentialController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    issueCredential(body: any): Promise<{
        credentialCode: string;
        tokenURI: string;
        walletAddress: string;
    }>;
    revokeCredential(body: {
        tokenId: number;
        reason: string;
    }): Promise<{
        success: boolean;
        txHash: any;
        message: string;
    }>;
    reissueCredential(body: any): Promise<{
        success: boolean;
        txHash: any;
        newTokenURI: string;
        credentialCode: string;
        message: string;
    }>;
}
