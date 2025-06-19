import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    bindWallet(body: {
        walletAddress: string;
        studentId?: string;
        role: string;
        email?: string;
        firstName?: string;
        middleName?: string;
        lastName?: string;
        yearLevel?: number;
        programId?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        role: string;
        walletAddress: string;
        studentId: string | null;
        email: string | null;
        firstName: string | null;
        middleName: string | null;
        lastName: string | null;
        yearLevel: number | null;
        programId: number | null;
    }>;
    addAdmin(body: {
        walletAddress: string;
        email: string;
    }): Promise<{
        success: boolean;
        alreadyOnChain: boolean;
        user: {
            id: any;
            walletAddress: string;
            email: string;
            role: any;
        };
        message: string;
        txHash?: undefined;
    } | {
        success: boolean;
        txHash: any;
        user: {
            id: any;
            walletAddress: string;
            email: string;
            role: any;
        };
        message: string;
        alreadyOnChain?: undefined;
    }>;
    getRole(walletAddress: string): Promise<{
        role: string | null;
    }>;
    getByStudentId(studentId: string): Promise<{
        program: {
            id: number;
            name: string;
            abbreviation: string;
        } | null;
        firstName: string | null;
        middleName: string | null;
        lastName: string | null;
        yearLevel: number | null;
    }>;
}
