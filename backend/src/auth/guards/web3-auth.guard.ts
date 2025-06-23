/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class Web3AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // You may want to check headers or body; adjust as needed
    const { address, signature, message } = req.body;

    if (!address || !signature || !message)
      throw new UnauthorizedException('Missing signature or address.');

    // Verify the signature
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature.');
    }

    req.user = { address }; // Attach wallet info to the request
    return true;
  }
}
