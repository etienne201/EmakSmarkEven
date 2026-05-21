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
exports.AIController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AIController = class AIController {
    async generateTheme(id, body) {
        return { theme: {} };
    }
    async generateLayout(id, body) {
        return { layout: {} };
    }
    async generateInvitation(id, body) {
        return { invitation: {} };
    }
    async suggestColors(id, body) {
        return { colors: [] };
    }
};
exports.AIController = AIController;
__decorate([
    (0, common_1.Post)('generate-theme'),
    (0, swagger_1.ApiOperation)({ summary: 'Générer un thème par IA' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateTheme", null);
__decorate([
    (0, common_1.Post)('generate-layout'),
    (0, swagger_1.ApiOperation)({ summary: 'Générer une mise en page par IA' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateLayout", null);
__decorate([
    (0, common_1.Post)('generate-invitation'),
    (0, swagger_1.ApiOperation)({ summary: 'Générer une invitation par IA' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "generateInvitation", null);
__decorate([
    (0, common_1.Post)('suggest-colors'),
    (0, swagger_1.ApiOperation)({ summary: 'Suggérer une palette de couleurs par IA' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AIController.prototype, "suggestColors", null);
exports.AIController = AIController = __decorate([
    (0, swagger_1.ApiTags)('Design & Content'),
    (0, common_1.Controller)('events/:id/ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)()
], AIController);
//# sourceMappingURL=ai.controller.js.map