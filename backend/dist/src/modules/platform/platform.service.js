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
exports.PlatformService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PlatformService = class PlatformService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        return this.prisma.platformSetting.findMany();
    }
    async updateSetting(key, value) {
        return this.prisma.platformSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
    async getHealth() {
        return { status: 'OK', timestamp: new Date() };
    }
    async findAllTemplates() {
        return this.prisma.template.findMany();
    }
    async createTemplate(data) {
        return this.prisma.template.create({ data });
    }
    async findAllWebhooks(orgId) {
        return this.prisma.webhook.findMany({ where: { organizationId: orgId } });
    }
    async createWebhook(orgId, data) {
        return this.prisma.webhook.create({
            data: { ...data, organizationId: orgId },
        });
    }
    async findAllApiKeys(orgId) {
        return this.prisma.apiKey.findMany({ where: { organizationId: orgId } });
    }
    async createApiKey(orgId, name) {
        return this.prisma.apiKey.create({
            data: {
                name,
                keyHash: `sk_${Math.random().toString(36).substring(7)}`,
                organizationId: orgId,
            },
        });
    }
    async getAuditLogs() {
        return this.prisma.securityAuditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.PlatformService = PlatformService;
exports.PlatformService = PlatformService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformService);
//# sourceMappingURL=platform.service.js.map