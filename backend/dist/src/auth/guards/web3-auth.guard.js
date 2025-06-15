"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
let Web3AuthGuard = class Web3AuthGuard {
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const { address, signature, message } = req.body;
        if (!address || !signature || !message)
            throw new common_1.UnauthorizedException('Missing signature or address.');
        const recovered = ethers_1.ethers.verifyMessage(message, signature);
        if (recovered.toLowerCase() !== address.toLowerCase()) {
            throw new common_1.UnauthorizedException('Invalid signature.');
        }
        req.user = { address };
        return true;
    }
};
exports.Web3AuthGuard = Web3AuthGuard;
exports.Web3AuthGuard = Web3AuthGuard = __decorate([
    (0, common_1.Injectable)()
], Web3AuthGuard);
//# sourceMappingURL=web3-auth.guard.js.map