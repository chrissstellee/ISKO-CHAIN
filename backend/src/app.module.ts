/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CredentialController } from './credential/credential.controller';
import { ProgramModule } from './program/program.module';

@Module({
  imports: [PrismaModule, UserModule, ProgramModule],
  controllers: [CredentialController],
})
export class AppModule {}
