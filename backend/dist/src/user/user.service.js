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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ethers_1 = require("ethers");
const IskoChainCredential_json_1 = __importDefault(require("../../abis/IskoChainCredential.json"));
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bindWallet(walletAddress, studentId, role = 'student', email, firstName, middleName, lastName, yearLevel, programId) {
        return this.prisma.user.upsert({
            where: { walletAddress: walletAddress.toLowerCase() },
            update: { studentId, role, email, yearLevel, programId },
            create: { walletAddress: walletAddress.toLowerCase(), studentId, role, email, firstName, middleName, lastName, yearLevel, programId },
        });
    }
    async addAdminUnified(walletAddress, email) {
        walletAddress = ethers_1.ethers.getAddress(walletAddress);
        let user;
        try {
            user = await this.prisma.user.upsert({
                where: { walletAddress },
                update: { role: 'admin', email },
                create: { walletAddress: walletAddress.toLowerCase(), role: 'admin', email },
            });
        }
        catch (err) {
            throw new common_1.BadRequestException('Failed to create admin in database: ' + err.message);
        }
        try {
            const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
            const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
            const signer = new ethers_1.ethers.Wallet(adminPrivateKey, provider);
            const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, IskoChainCredential_json_1.default, signer);
            const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, signer.address);
            if (!hasAdminRole) {
                throw new Error(`Configured admin signer (${signer.address}) does not have DEFAULT_ADMIN_ROLE.`);
            }
            const isAlreadyAdmin = await contract.hasRole(await contract.ADMIN_ROLE(), walletAddress);
            if (isAlreadyAdmin) {
                return {
                    success: true,
                    alreadyOnChain: true,
                    user: { id: user.id, walletAddress, email, role: user.role },
                    message: 'Admin already has on-chain ADMIN_ROLE. Only database was updated.',
                };
            }
            const tx = await contract.addAdmin(walletAddress);
            await tx.wait();
            return {
                success: true,
                txHash: tx.hash,
                user: { id: user.id, walletAddress, email, role: user.role },
                message: 'Admin added to both DB and smart contract.',
            };
        }
        catch (err) {
            await this.prisma.user.delete({ where: { walletAddress } });
            console.error('[addAdminUnified] Error:', err);
            throw new common_1.BadRequestException('Failed to grant admin on chain: ' +
                (err.reason || err.message || JSON.stringify(err)));
        }
    }
    async getRole(walletAddress) {
        const user = await this.prisma.user.findUnique({
            where: { walletAddress: walletAddress.toLowerCase() }
        });
        return { role: user?.role || null };
    }
    async findByWallet(walletAddress) {
        return this.prisma.user.findUnique({
            where: { walletAddress: walletAddress.toLowerCase() },
        });
    }
    async findByStudentId(studentId) {
        return this.prisma.user.findUnique({
            where: { studentId },
            select: {
                firstName: true,
                middleName: true,
                lastName: true,
                yearLevel: true,
                program: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true
                    }
                }
            },
        });
    }
    async getUsers({ role, search, page, pageSize, programId }) {
        const where = { role };
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search } },
                { walletAddress: { contains: search } },
                { email: { contains: search } },
            ];
        }
        if (role === 'student' && programId) {
            where.programId = programId;
        }
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: { program: true },
                orderBy: { id: 'desc' }
            }),
            this.prisma.user.count({ where }),
        ]);
        return { users, total };
    }
    async updateUser(id, body) {
        return this.prisma.user.update({
            where: { id },
            data: body,
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
    async isSuperadmin(walletAddress) {
        if (!walletAddress)
            return false;
        const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
        const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, IskoChainCredential_json_1.default, provider);
        const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
        return await contract.hasRole(DEFAULT_ADMIN_ROLE, walletAddress);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map