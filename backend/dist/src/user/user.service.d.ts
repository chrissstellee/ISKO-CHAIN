import { PrismaService } from 'prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    bindWallet(walletAddress: string, studentId?: string, role?: string, email?: string, firstName?: string, middleName?: string, lastName?: string, yearLevel?: number, programId?: number): Promise<{
        id: number;
        createdAt: Date;
        walletAddress: string;
        studentId: string | null;
        role: string;
        email: string | null;
        firstName: string | null;
        middleName: string | null;
        lastName: string | null;
        yearLevel: number | null;
        programId: number | null;
    }>;
    getRole(walletAddress: string): Promise<{
        role: string | null;
    }>;
    findByWallet(walletAddress: string): Promise<{
        id: number;
        createdAt: Date;
        walletAddress: string;
        studentId: string | null;
        role: string;
        email: string | null;
        firstName: string | null;
        middleName: string | null;
        lastName: string | null;
        yearLevel: number | null;
        programId: number | null;
    } | null>;
    findByStudentId(studentId: string): Promise<{
        program: {
            id: number;
            name: string;
            abbreviation: string;
        } | null;
        firstName: string | null;
        middleName: string | null;
        lastName: string | null;
        yearLevel: number | null;
    } | null>;
}
