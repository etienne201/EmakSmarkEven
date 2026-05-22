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
exports.FormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const form_dto_1 = require("./dto/form.dto");
let FormsController = class FormsController {
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
    async respond(id, answers) {
        return { success: true };
    }
    async getResponses(id) {
        return [];
    }
};
exports.FormsController = FormsController;
__decorate([
    (0, common_1.Get)('events/:id/forms'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les formulaires d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('events/:id/forms'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un formulaire dynamique' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_dto_1.CreateFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('forms/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un formulaire' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_dto_1.UpdateFormDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('forms/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un formulaire' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('forms/:id/respond'),
    (0, swagger_1.ApiOperation)({ summary: 'Répondre à un formulaire' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, form_dto_1.FormResponseDto]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "respond", null);
__decorate([
    (0, common_1.Get)('forms/:id/responses'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les réponses d un formulaire' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FormsController.prototype, "getResponses", null);
exports.FormsController = FormsController = __decorate([
    (0, swagger_1.ApiTags)('Engagement'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)()
], FormsController);
//# sourceMappingURL=forms.controller.js.map