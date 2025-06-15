/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

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
        program: {         // <--- THIS IS IMPORTANT!
          select: {
            id: true,
            name: true,
            abbreviation: true
          }
        }
      },
    });
  }
}
