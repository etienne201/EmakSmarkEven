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
exports.PlatformController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const platform_service_1 = require("./platform.service");
const update_setting_dto_1 = require("./dto/update-setting.dto");
const platform_dto_1 = require("./dto/platform.dto");
let PlatformController = class PlatformController {
    constructor(platformService) {
        this.platformService = platformService;
    }
    async getSettings() {
        return this.platformService.getSettings();
    }
    async updateSetting(dto) {
        return this.platformService.updateSetting(dto.key, dto.value);
    }
    async getHealth() {
        return this.platformService.getHealth();
    }
    async findTemplates() {
        return this.platformService.findAllTemplates();
    }
    async createTemplate(dto) {
        return this.platformService.createTemplate(dto);
    }
    async findWebhooks(orgId) {
        return this.platformService.findAllWebhooks(orgId);
    }
    async createWebhook(orgId, dto) {
        return this.platformService.createWebhook(orgId, dto);
    }
    async findApiKeys(orgId) {
        return this.platformService.findAllApiKeys(orgId);
    }
    async createApiKey(orgId, body) {
        return this.platformService.createApiKey(orgId, body.name);
    }
    async getAuditLogs() {
        return this.platformService.getAuditLogs();
    }
    async getLoginHistory() {
        return this.platformService.getAuditLogs();
    }
};
exports.PlatformController = PlatformController;
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les paramètres globaux' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)('settings'),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un paramètre' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_setting_dto_1.UpdateSettingDto]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "updateSetting", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Santé du système' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "findTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un template (Super Admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [platform_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('webhooks'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les webhooks' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "findWebhooks", null);
__decorate([
    (0, common_1.Post)('webhooks'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un webhook' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_dto_1.CreateWebhookDto]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "createWebhook", null);
__decorate([
    (0, common_1.Get)('api-keys'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les clés API' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "findApiKeys", null);
__decorate([
    (0, common_1.Post)('api-keys'),
    (0, swagger_1.ApiOperation)({ summary: 'Générer une clé API' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, platform_dto_1.CreateApiKeyDto]),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "createApiKey", null);
__decorate([
    (0, common_1.Get)('security/audit-logs'),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les logs d audit (Super Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('security/login-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Historique des connexions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformController.prototype, "getLoginHistory", null);
exports.PlatformController = PlatformController = __decorate([
    (0, swagger_1.ApiTags)('Platform Admin'),
    (0, common_1.Controller)('platform'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [platform_service_1.PlatformService])
], PlatformController);
//# sourceMappingURL=platform.controller.js.map