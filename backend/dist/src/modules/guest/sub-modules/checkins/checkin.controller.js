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
exports.CheckinController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
let CheckinController = class CheckinController {
    async checkin(body) {
        return { success: true };
    }
    async findAll(id) {
        return [];
    }
    async live() {
        return [];
    }
};
exports.CheckinController = CheckinController;
__decorate([
    (0, common_1.Post)('checkins'),
    (0, swagger_1.ApiOperation)({ summary: 'Effectuer un check-in' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "checkin", null);
__decorate([
    (0, common_1.Get)('events/:id/checkins'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les check-ins d un événement' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('checkins/live'),
    (0, swagger_1.ApiOperation)({ summary: 'Flux en direct des check-ins' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CheckinController.prototype, "live", null);
exports.CheckinController = CheckinController = __decorate([
    (0, swagger_1.ApiTags)('Guests & Attendance'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)()
], CheckinController);
//# sourceMappingURL=checkin.controller.js.map