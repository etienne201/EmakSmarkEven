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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETUP_STEP_DTOS = exports.UpdateEventModulesDto = exports.UpdateEventSettingsDto = exports.SetupStep5Dto = exports.SetupStep4Dto = exports.SetupStep3Dto = exports.SetupModulesDto = exports.SetupStep2Dto = exports.SetupStep1Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class SetupStep1Dto {
}
exports.SetupStep1Dto = SetupStep1Dto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mariage Awa & Karim' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SetupStep1Dto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'mariage-awa-karim' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Le slug doit être en minuscules, sans espaces (lettres, chiffres et tirets uniquement).',
    }),
    __metadata("design:type", String)
], SetupStep1Dto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], SetupStep1Dto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.EventTypeKey, example: 'wedding' }),
    (0, class_validator_1.IsEnum)(client_1.EventTypeKey),
    __metadata("design:type", String)
], SetupStep1Dto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'fr' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], SetupStep1Dto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.VisibilityType, default: client_1.VisibilityType.private }),
    (0, class_validator_1.IsEnum)(client_1.VisibilityType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep1Dto.prototype, "visibility", void 0);
class SetupStep2Dto {
}
exports.SetupStep2Dto = SetupStep2Dto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep2Dto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep2Dto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep2Dto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Europe/Paris' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SetupStep2Dto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-21T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SetupStep2Dto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-05-22T22:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep2Dto.prototype, "endDate", void 0);
class SetupModulesDto {
}
exports.SetupModulesDto = SetupModulesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "guests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "invitations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "qrCheckin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "tables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "seating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "analytics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "badges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SetupModulesDto.prototype, "notifications", void 0);
class SetupStep3Dto {
}
exports.SetupStep3Dto = SetupStep3Dto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: SetupModulesDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SetupModulesDto),
    __metadata("design:type", SetupModulesDto)
], SetupStep3Dto.prototype, "modules", void 0);
class SetupStep4Dto {
}
exports.SetupStep4Dto = SetupStep4Dto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'elegant-gold' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep4Dto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tokens de couleurs (clé → hex)' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SetupStep4Dto.prototype, "colors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep4Dto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetupStep4Dto.prototype, "bannerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Réglages typographiques' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SetupStep4Dto.prototype, "typography", void 0);
class SetupStep5Dto {
}
exports.SetupStep5Dto = SetupStep5Dto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['Famille', 'Amis', 'VIP'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SetupStep5Dto.prototype, "guestCategories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['Accueil', 'Sécurité'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SetupStep5Dto.prototype, "staffCategories", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Permissions personnalisées par catégorie' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SetupStep5Dto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accès personnalisés' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SetupStep5Dto.prototype, "customAccess", void 0);
class UpdateEventSettingsDto {
}
exports.UpdateEventSettingsDto = UpdateEventSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "rsvpEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "qrEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "checkinEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "networkingEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "livestreamEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEventSettingsDto.prototype, "guestLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateEventSettingsDto.prototype, "customRules", void 0);
class UpdateEventModulesDto {
}
exports.UpdateEventModulesDto = UpdateEventModulesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: SetupModulesDto }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SetupModulesDto),
    __metadata("design:type", SetupModulesDto)
], UpdateEventModulesDto.prototype, "modules", void 0);
exports.SETUP_STEP_DTOS = {
    1: SetupStep1Dto,
    2: SetupStep2Dto,
    3: SetupStep3Dto,
    4: SetupStep4Dto,
    5: SetupStep5Dto,
};
//# sourceMappingURL=event-setup.dto.js.map