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
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const create_organization_dto_1 = require("./dto/create-organization.dto");
const update_organization_dto_1 = require("./dto/update-organization.dto");
const organizations_service_1 = require("./organizations.service");
const organization_user_dto_1 = require("./dto/organization-user.dto");
let OrganizationsController = class OrganizationsController {
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    async findAll() {
        return this.organizationsService.findAll();
    }
    async create(dto) {
        return this.organizationsService.create(dto);
    }
    async findOne(id) {
        return this.organizationsService.findOne(id);
    }
    async update(id, dto) {
        return this.organizationsService.update(id, dto);
    }
    async remove(id) {
        return this.organizationsService.remove(id);
    }
    async findUsers(id) {
        return this.organizationsService.findUsers(id);
    }
    async addUser(id, dto) {
        return this.organizationsService.addUser(id, dto);
    }
    async updateUser(id, userId, dto) {
        return this.organizationsService.updateUser(id, userId, dto);
    }
    async removeUser(id, userId) {
        return this.organizationsService.removeUser(id, userId);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, permissions_decorator_1.Permissions)('organizations.list'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les organisations (Super Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, permissions_decorator_1.Permissions)('organizations.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une organisation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('organizations.list'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une organisation par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('organizations.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier une organisation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_organization_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, permissions_decorator_1.Permissions)('organizations.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une organisation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, permissions_decorator_1.Permissions)('organizations.users'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les utilisateurs d une organisation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findUsers", null);
__decorate([
    (0, common_1.Post)(':id/users'),
    (0, permissions_decorator_1.Permissions)('organizations.users'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un utilisateur à une organisation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organization_user_dto_1.AddOrganizationUserDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "addUser", null);
__decorate([
    (0, common_1.Put)(':id/users/:userId'),
    (0, permissions_decorator_1.Permissions)('organizations.users'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un utilisateur d une organisation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, organization_user_dto_1.UpdateOrganizationUserDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id/users/:userId'),
    (0, permissions_decorator_1.Permissions)('organizations.users'),
    (0, swagger_1.ApiOperation)({ summary: 'Retirer un utilisateur d une organisation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "removeUser", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('Organizations'),
    (0, common_1.Controller)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map