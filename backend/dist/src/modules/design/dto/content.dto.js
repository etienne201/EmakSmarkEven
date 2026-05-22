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
exports.UpdateContentDto = exports.CreateContentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateContentDto {
}
exports.CreateContentDto = CreateContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hero Banner' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hero' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { text: 'Welcome to the gala!', image: '...' } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateContentDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateContentDto.prototype, "order", void 0);
class UpdateContentDto extends (0, swagger_1.PartialType)(CreateContentDto) {
}
exports.UpdateContentDto = UpdateContentDto;
//# sourceMappingURL=content.dto.js.map