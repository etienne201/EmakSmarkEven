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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const create_guest_dto_1 = require("../guest/dto/create-guest.dto");
const admin_dto_1 = require("./dto/admin.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStats(id) {
        return this.adminService.getEventStats(id);
    }
    async getGuests(id) {
        return this.adminService.getGuests(id);
    }
    async updateConfig(id, data) {
        return this.adminService.updateEventConfig(id, data);
    }
    async addGuest(id, guestData) {
        return this.adminService.addGuest(id, guestData);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('events/:id/stats'),
    (0, permissions_decorator_1.Permissions)('analytics.view'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les statistiques d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('events/:id/guests'),
    (0, permissions_decorator_1.Permissions)('guests.list'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les invités d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGuests", null);
__decorate([
    (0, common_1.Post)('events/:id/config'),
    (0, permissions_decorator_1.Permissions)('events.settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour la configuration d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateEventConfigDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Post)('events/:id/guests'),
    (0, permissions_decorator_1.Permissions)('guests.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un invité à un événement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invité créé avec succès' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_guest_dto_1.CreateGuestDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addGuest", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Organization Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map