/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Put, Query, Delete, Param, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Post('bind-wallet')
    async bindWallet(@Body() body: { walletAddress: string; studentId?: string; role: string; email?: string; firstName?: string; middleName?: string; lastName?: string; yearLevel?: number, programId?: number }) {
        return this.userService.bindWallet(body.walletAddress, body.studentId, body.role, body.email, body.firstName, body.middleName, body.lastName, body.yearLevel, body.programId);
    }

    @Post('add-admin')
    async addAdmin(@Body() body: { walletAddress: string; email: string }) {
        return this.userService.addAdminUnified(body.walletAddress, body.email);
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

  // --- NEW: GET USERS (with search, pagination, filter) ---
  @Get()
  async getUsers(
    @Query('role') role: string,
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('programId') programId: string,
  ) {
    return this.userService.getUsers({
      role,
      search,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      programId: programId ? Number(programId) : undefined,
    });
  }

  // --- NEW: UPDATE USER (Admin or Student) ---
  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const updated = await this.userService.updateUser(id, body);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  // --- NEW: DELETE USER ---
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.userService.deleteUser(id);
    if (!deleted) throw new NotFoundException('User not found or already deleted');
    return { success: true };
  }

  @Get('is-superadmin')
  async isSuperadmin(@Query('walletAddress') walletAddress: string) {
    const isSuperadmin = await this.userService.isSuperadmin(walletAddress);
    return { isSuperadmin };
  }
}
