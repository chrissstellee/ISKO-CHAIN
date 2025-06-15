/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Post('bind-wallet')
    async bindWallet(@Body() body: { walletAddress: string; studentId?: string; role: string; email?: string; firstName?: string; middleName?: string; lastName?: string; yearLevel?: number, programId?: number }) {
        return this.userService.bindWallet(body.walletAddress, body.studentId, body.role, body.email, body.firstName, body.middleName, body.lastName, body.yearLevel, body.programId);
    }

    @Get('get-role')
    async getRole(@Query('walletAddress') walletAddress: string) {
        return this.userService.getRole(walletAddress);
    }

    @Get('by-student-id/:studentId')
    async getByStudentId(@Param('studentId') studentId: string) {
        const user = await this.userService.findByStudentId(studentId);
        if (!user) throw new NotFoundException('Student not found');
        return user;
    }
}
