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
exports.ThemesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const design_service_1 = require("./design.service");
const update_theme_dto_1 = require("./dto/update-theme.dto");
let ThemesController = class ThemesController {
    constructor(designService) {
        this.designService = designService;
    }
    async findAll(id) {
        return this.designService.findEventThemes(id);
    }
    async create(id, dto) {
        return this.designService.createEventTheme(id, dto);
    }
    async findOne(id) {
        return this.designService.findOneTheme(id);
    }
    async update(id, dto) {
        return this.designService.updateEventTheme(id, dto);
    }
    async remove(id) {
        return this.designService.deleteEventTheme(id);
    }
};
exports.ThemesController = ThemesController;
__decorate([
    (0, common_1.Get)('events/:id/themes'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les thèmes d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('events/:id/themes'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un thème pour l événement' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_theme_dto_1.UpdateThemeDto]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('themes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un thème' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('themes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un thème' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_theme_dto_1.UpdateThemeDto]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('themes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un thème' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "remove", null);
exports.ThemesController = ThemesController = __decorate([
    (0, swagger_1.ApiTags)('Design & Content'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [design_service_1.DesignService])
], ThemesController);
//# sourceMappingURL=themes.controller.js.map