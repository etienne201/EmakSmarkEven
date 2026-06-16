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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let AnalyticsController = class AnalyticsController {
    async getSummary(id) {
        return { views: 0, checkins: 0 };
    }
    async getViews(id) {
        return [];
    }
    async getCheckins(id) {
        return [];
    }
    async getEngagement(id) {
        return [];
    }
    async getGuests(id) {
        return [];
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Résumé analytique global' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('views'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques des vues' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getViews", null);
__decorate([
    (0, common_1.Get)('checkins'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques des check-ins' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCheckins", null);
__decorate([
    (0, common_1.Get)('engagement'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques d engagement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEngagement", null);
__decorate([
    (0, common_1.Get)('guests'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyses démographiques des invités' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGuests", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics & Reports'),
    (0, common_1.Controller)('events/:id/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)()
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map