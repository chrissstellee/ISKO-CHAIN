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
