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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async bindWallet(body) {
        return this.userService.bindWallet(body.walletAddress, body.studentId, body.role, body.email, body.firstName, body.middleName, body.lastName, body.yearLevel, body.programId);
    }
    async addAdmin(body) {
        return this.userService.addAdminUnified(body.walletAddress, body.email);
    }
    async getRole(walletAddress) {
        return this.userService.getRole(walletAddress);
    }
    async getByStudentId(studentId) {
        const user = await this.userService.findByStudentId(studentId);
        if (!user)
            throw new common_1.NotFoundException('Student not found');
        return user;
    }
    async getUsers(role, search, page, pageSize, programId) {
        return this.userService.getUsers({
            role,
            search,
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 10,
            programId: programId ? Number(programId) : undefined,
        });
    }
    async updateUser(id, body) {
        const updated = await this.userService.updateUser(id, body);
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        return updated;
    }
    async deleteUser(id) {
        const deleted = await this.userService.deleteUser(id);
        if (!deleted)
            throw new common_1.NotFoundException('User not found or already deleted');
        return { success: true };
    }
    async isSuperadmin(walletAddress) {
        const isSuperadmin = await this.userService.isSuperadmin(walletAddress);
        return { isSuperadmin };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('bind-wallet'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "bindWallet", null);
__decorate([
    (0, common_1.Post)('add-admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addAdmin", null);
__decorate([
    (0, common_1.Get)('get-role'),
    __param(0, (0, common_1.Query)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getRole", null);
__decorate([
    (0, common_1.Get)('by-student-id/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getByStudentId", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('role')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __param(4, (0, common_1.Query)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('is-superadmin'),
    __param(0, (0, common_1.Query)('walletAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isSuperadmin", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map