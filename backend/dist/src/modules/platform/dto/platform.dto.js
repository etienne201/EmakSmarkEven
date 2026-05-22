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
exports.CreateApiKeyDto = exports.CreateWebhookDto = exports.CreateTemplateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTemplateDto {
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Modern Wedding' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'wedding' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com/preview.jpg' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "previewUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { colors: { primary: '#000' } } }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateTemplateDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTemplateDto.prototype, "isPremium", void 0);
class CreateWebhookDto {
}
exports.CreateWebhookDto = CreateWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://my-service.com/webhook' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWebhookDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['event.created', 'guest.registered'] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateWebhookDto.prototype, "events", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateWebhookDto.prototype, "isActive", void 0);
class CreateApiKeyDto {
}
exports.CreateApiKeyDto = CreateApiKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My App Key' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "name", void 0);
//# sourceMappingURL=platform.dto.js.map