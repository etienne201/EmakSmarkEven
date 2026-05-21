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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let PublicController = class PublicController {
    async findEvent(slug) {
        return { slug };
    }
    async findSessions(slug) {
        return [];
    }
    async findInvitation(code) {
        return { code };
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)('events/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un événement via son slug (Public)' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "findEvent", null);
__decorate([
    (0, common_1.Get)('events/:slug/sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les sessions publiques d un événement' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "findSessions", null);
__decorate([
    (0, common_1.Get)('invitations/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Consulter une invitation via son code (Public)' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "findInvitation", null);
exports.PublicController = PublicController = __decorate([
    (0, swagger_1.ApiTags)('Public API'),
    (0, common_1.Controller)('public')
], PublicController);
//# sourceMappingURL=public.controller.js.map