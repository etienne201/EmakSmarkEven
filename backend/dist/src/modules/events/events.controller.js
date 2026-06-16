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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const events_service_1 = require("./events.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const event_setup_dto_1 = require("./dto/event-setup.dto");
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async findAll(organizationId) {
        return this.eventsService.findAll(organizationId);
    }
    async create(dto, user) {
        return this.eventsService.create(dto, user);
    }
    async findOne(id) {
        return this.eventsService.findOne(id);
    }
    async update(id, dto) {
        return this.eventsService.update(id, dto);
    }
    async remove(id) {
        return this.eventsService.remove(id);
    }
    async setupStatus(id) {
        return this.eventsService.getSetupStatus(id);
    }
    async setupStep(id, stepId, body) {
        return this.eventsService.saveStep(id, stepId, body);
    }
    async setupFinalize(id) {
        return this.eventsService.finalizeSetup(id);
    }
    async getSettings(id) {
        return this.eventsService.getSettings(id);
    }
    async updateSettings(id, dto) {
        return this.eventsService.updateSettings(id, dto);
    }
    async getModules(id) {
        return this.eventsService.getModules(id);
    }
    async updateModules(id, body) {
        return this.eventsService.updateModules(id, body.modules);
    }
    async getWorkflow(id) {
        return this.eventsService.getWorkflow(id);
    }
    async workflowReview(id) {
        return this.eventsService.submitForReview(id);
    }
    async workflowApprove(id, user) {
        return this.eventsService.approve(id, user.id);
    }
    async workflowPublish(id) {
        return this.eventsService.publish(id);
    }
    async workflowArchive(id) {
        return this.eventsService.archive(id);
    }
    async publish(id) {
        return this.eventsService.publish(id);
    }
    async unpublish(id) {
        return this.eventsService.unpublish(id);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('events.list'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister tous les événements' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('events.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un événement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Événement créé avec succès' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('events.list'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un événement par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('events.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('events.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/setup/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le statut du wizard de configuration' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "setupStatus", null);
__decorate([
    (0, common_1.Post)(':id/setup/step/:stepId'),
    (0, permissions_decorator_1.Permissions)('events.settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer une étape du wizard (1-5)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('stepId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "setupStep", null);
__decorate([
    (0, common_1.Post)(':id/setup/finalize'),
    (0, permissions_decorator_1.Permissions)('events.settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Finaliser la configuration initiale' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "setupFinalize", null);
__decorate([
    (0, common_1.Get)(':id/settings'),
    (0, swagger_1.ApiOperation)({ summary: "Récupérer les réglages de l'événement" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)(':id/settings'),
    (0, permissions_decorator_1.Permissions)('events.settings'),
    (0, swagger_1.ApiOperation)({ summary: "Modifier les réglages de l'événement" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_setup_dto_1.UpdateEventSettingsDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)(':id/modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les modules activés' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getModules", null);
__decorate([
    (0, common_1.Put)(':id/modules'),
    (0, permissions_decorator_1.Permissions)('events.settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Activer/Désactiver des modules (contraintes appliquées)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_setup_dto_1.UpdateEventModulesDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateModules", null);
__decorate([
    (0, common_1.Get)(':id/workflow'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer le statut du workflow de validation' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getWorkflow", null);
__decorate([
    (0, common_1.Post)(':id/workflow/review'),
    (0, permissions_decorator_1.Permissions)('events.workflow'),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre pour revue' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "workflowReview", null);
__decorate([
    (0, common_1.Post)(':id/workflow/approve'),
    (0, roles_decorator_1.Roles)('Super Admin'),
    (0, swagger_1.ApiOperation)({ summary: "Approuver l'événement (Super Admin)" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "workflowApprove", null);
__decorate([
    (0, common_1.Post)(':id/workflow/publish'),
    (0, permissions_decorator_1.Permissions)('events.publish'),
    (0, swagger_1.ApiOperation)({ summary: "Publier l'événement" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "workflowPublish", null);
__decorate([
    (0, common_1.Post)(':id/workflow/archive'),
    (0, permissions_decorator_1.Permissions)('events.workflow'),
    (0, swagger_1.ApiOperation)({ summary: "Archiver l'événement" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "workflowArchive", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, permissions_decorator_1.Permissions)('events.publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publier' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/unpublish'),
    (0, permissions_decorator_1.Permissions)('events.publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Dépublier' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "unpublish", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('Events'),
    (0, common_1.Controller)('events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map