/* eslint-disable prettier/prettier */
// src/program/program.module.ts
import { Module } from '@nestjs/common';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProgramController],
  providers: [ProgramService, PrismaService],
  exports: [ProgramService],
})
export class ProgramModule {}
