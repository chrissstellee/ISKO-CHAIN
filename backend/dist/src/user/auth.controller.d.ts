import { UserService } from './user.service';
export declare class AuthController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(body: any): Promise<{
        email: string | null;
    }>;
}
