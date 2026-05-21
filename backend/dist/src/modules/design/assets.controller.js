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
exports.AssetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AssetsController = class AssetsController {
    async upload() {
        return { url: '...' };
    }
    async findOne(id) {
        return { id };
    }
    async remove(id) {
        return { success: true };
    }
    async getGallery(id) {
        return [];
    }
    async addToGallery(id) {
        return { success: true };
    }
    async removeFromGallery(id, assetId) {
        return { success: true };
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Post)('assets/upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Uploader un asset (image, PDF)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('assets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer les métadonnées d un asset' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('assets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un asset' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('events/:id/gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les assets de la galerie d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getGallery", null);
__decorate([
    (0, common_1.Post)('events/:id/gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un asset à la galerie' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "addToGallery", null);
__decorate([
    (0, common_1.Delete)('events/:id/gallery/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Retirer un asset de la galerie' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "removeFromGallery", null);
exports.AssetsController = AssetsController = __decorate([
    (0, swagger_1.ApiTags)('Design & Content'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)()
], AssetsController);
//# sourceMappingURL=assets.controller.js.map