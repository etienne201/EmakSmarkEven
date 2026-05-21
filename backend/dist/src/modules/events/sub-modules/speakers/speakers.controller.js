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
exports.SpeakersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
let SpeakersController = class SpeakersController {
    async findAll(id) {
        return [];
    }
    async create(id, dto) {
        return { success: true };
    }
    async update(id, dto) {
        return { success: true };
    }
    async remove(id) {
        return { success: true };
    }
};
exports.SpeakersController = SpeakersController;
__decorate([
    (0, common_1.Get)('events/:id/speakers'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les intervenants d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('events/:id/speakers'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un intervenant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpeakersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('speakers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un intervenant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpeakersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('speakers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un intervenant' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpeakersController.prototype, "remove", null);
exports.SpeakersController = SpeakersController = __decorate([
    (0, swagger_1.ApiTags)('Event Logistics'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)()
], SpeakersController);
//# sourceMappingURL=speakers.controller.js.map