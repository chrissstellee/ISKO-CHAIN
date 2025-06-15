/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CredentialController } from '../credential/credential.controller';
import { AuthController } from './auth.controller';


@Module({
  controllers: [UserController, CredentialController, AuthController],
  providers: [UserService],
})
export class UserModule {}
