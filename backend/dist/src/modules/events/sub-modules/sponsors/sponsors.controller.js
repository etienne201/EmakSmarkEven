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
exports.SponsorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const sponsor_dto_1 = require("./dto/sponsor.dto");
let SponsorsController = class SponsorsController {
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
exports.SponsorsController = SponsorsController;
__decorate([
    (0, common_1.Get)('events/:id/sponsors'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les sponsors d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SponsorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('events/:id/sponsors'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un sponsor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sponsor_dto_1.CreateSponsorDto]),
    __metadata("design:returntype", Promise)
], SponsorsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('sponsors/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un sponsor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sponsor_dto_1.UpdateSponsorDto]),
    __metadata("design:returntype", Promise)
], SponsorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('sponsors/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un sponsor' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SponsorsController.prototype, "remove", null);
exports.SponsorsController = SponsorsController = __decorate([
    (0, swagger_1.ApiTags)('Event Logistics'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)()
], SponsorsController);
//# sourceMappingURL=sponsors.controller.js.map