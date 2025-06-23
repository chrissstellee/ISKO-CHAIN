import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class Web3AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
