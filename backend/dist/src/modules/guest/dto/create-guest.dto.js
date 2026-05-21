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
exports.CreateGuestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateGuestDto {
}
exports.CreateGuestDto = CreateGuestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'john@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '+33612345678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.GuestRole, default: client_1.GuestRole.attendee }),
    (0, class_validator_1.IsEnum)(client_1.GuestRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "guestRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.GuestStatus, default: client_1.GuestStatus.pending }),
    (0, class_validator_1.IsEnum)(client_1.GuestStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGuestDto.prototype, "status", void 0);
//# sourceMappingURL=create-guest.dto.js.map