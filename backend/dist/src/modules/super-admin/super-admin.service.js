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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../database/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let SuperAdminService = class SuperAdminService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async getPlatformStats() {
        const totalOrganizations = await this.prisma.organization.count();
        const totalUsers = await this.prisma.user.count();
        const totalEvents = await this.prisma.event.count();
        return { totalOrganizations, totalUsers, totalEvents };
    }
    async getAllAdmins() {
        return this.prisma.user.findMany({
            include: { organization: true, role: true },
        });
    }
    async blockOrganization(id) {
        return this.prisma.organization.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getAllSystemLogs() {
        return this.prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async createAdminAccount(data) {
        const plainPassword = data.passwordHash;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const organization = await this.prisma.organization.create({
            data: {
                name: data.organizationName,
                slug: data.organizationSlug,
                owner: {
                    create: {
                        email: data.email,
                        passwordHash: hashedPassword,
                        fullName: data.fullName,
                        role: {
                            connect: { name: 'ADMIN' },
                        },
                    },
                },
            },
            include: { owner: true },
        });
        const emailResult = await this.mailService.sendAdminInvitation(data.email, data.fullName, plainPassword, data.organizationSlug);
        return { ...organization, emailSent: emailResult.success, emailSimulated: !!emailResult.simulated };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map