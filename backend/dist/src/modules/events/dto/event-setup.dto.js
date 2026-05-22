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
exports.UpdateEventModulesDto = exports.UpdateEventSettingsDto = exports.EventSetupStepDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EventSetupStepDto {
}
exports.EventSetupStepDto = EventSetupStepDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: { name: 'Step Data', value: '...' } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], EventSetupStepDto.prototype, "metadata", void 0);
class UpdateEventSettingsDto {
}
exports.UpdateEventSettingsDto = UpdateEventSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "rsvpEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "qrEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateEventSettingsDto.prototype, "checkinEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateEventSettingsDto.prototype, "guestLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateEventSettingsDto.prototype, "customRules", void 0);
class UpdateEventModulesDto {
}
exports.UpdateEventModulesDto = UpdateEventModulesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['ticketing', 'networking', 'surveys'] }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], UpdateEventModulesDto.prototype, "modules", void 0);
//# sourceMappingURL=event-setup.dto.js.map