import { PrismaService } from 'prisma/prisma.service';
export declare class CredentialController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    issueCredential(body: any): Promise<{
        credentialCode: string;
        tokenURI: string;
        walletAddress: string;
    }>;
}
