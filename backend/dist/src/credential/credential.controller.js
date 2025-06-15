"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const PinataClient = require('@pinata/sdk');
const pinata = new PinataClient({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
});
function generateCredentialCode(credentialType, credentialDetails) {
    function getPrefix(type) {
        switch (type) {
            case "Degree Certificate": return "DIP";
            case "Course Completion": return "COMP";
            case "Honor/Award": return "HONOR";
            case "Workshop Certificate": return "WS";
            case "Transcript": return "TRANS";
            default: return "CRED";
        }
    }
    const prefix = getPrefix(credentialType);
    const year = new Date().getFullYear();
    let detailShort = "";
    if (credentialType === "Course Completion" || credentialType === "Workshop Certificate") {
        detailShort = "-" + (credentialDetails?.split(" ").map(w => w[0]).join("").toUpperCase() || "");
    }
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${detailShort}-${year}-${randomPart}`;
}
let CredentialController = class CredentialController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async issueCredential(body) {
        const { credentialType, studentId, credentialDetails, issueDate, issuer, additionalInfo, firstName, middleName, lastName, yearLevel, programName, } = body;
        const user = await this.prisma.user.findUnique({
            where: { studentId },
            include: { program: true },
        });
        if (!user || !user.walletAddress)
            throw new common_1.BadRequestException('Student not found or missing wallet.');
        const credentialCode = generateCredentialCode(credentialType, credentialDetails);
        const credentialMetadata = {
            credentialCode,
            credentialType,
            credentialDetails,
            studentId,
            issueDate,
            issuer,
            firstName: firstName ?? user.firstName,
            middleName: middleName ?? user.middleName,
            lastName: lastName ?? user.lastName,
            yearLevel: yearLevel ?? user.yearLevel,
            program: programName ?? user.program?.name ?? null,
            additionalInfo,
        };
        const pinRes = await pinata.pinJSONToIPFS(credentialMetadata, {
            pinataMetadata: { name: `Credential-${studentId}-${credentialCode}` },
        });
        const tokenURI = `https://gateway.pinata.cloud/ipfs/${pinRes.IpfsHash}`;
        return {
            credentialCode,
            tokenURI,
            walletAddress: user.walletAddress,
        };
    }
};
exports.CredentialController = CredentialController;
__decorate([
    (0, common_1.Post)('issue'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CredentialController.prototype, "issueCredential", null);
exports.CredentialController = CredentialController = __decorate([
    (0, common_1.Controller)('credentials'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CredentialController);
//# sourceMappingURL=credential.controller.js.map