/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Web3AuthGuard } from '../auth/guards/web3-auth.guard';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) {}

    @Post('me')
    @UseGuards(Web3AuthGuard)
    async getMe(@Body() body: any) {
        const { address } = body;
        if (!address) return { email: null };
        const user = await this.userService.findByWallet(address);
        return { email: user?.email || null };
    }
}
