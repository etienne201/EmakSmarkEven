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
exports.CreateEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Organisation cible. Optionnel : par défaut l'organisation de l'utilisateur authentifié (requis pour un Super Admin sans organisation).",
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Awesome Event' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'my-awesome-event' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'wedding' }),
    (0, class_validator_1.IsEnum)(client_1.EventTypeKey),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-21T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2026-05-22T22:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.VisibilityType, default: client_1.VisibilityType.private }),
    (0, class_validator_1.IsEnum)(client_1.VisibilityType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "visibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 'fr' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "country", void 0);
//# sourceMappingURL=create-event.dto.js.map