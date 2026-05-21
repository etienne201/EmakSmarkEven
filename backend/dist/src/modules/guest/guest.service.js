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
exports.GuestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let GuestService = class GuestService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(eventId) {
        return this.prisma.guest.findMany({
            where: { eventId },
        });
    }
    async findOne(id) {
        return this.prisma.guest.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.prisma.guest.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.guest.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.guest.delete({
            where: { id },
        });
    }
    async importGuests(eventId, file) {
        return { imported: 0 };
    }
    async exportGuests(eventId) {
        return { url: 'link-to-file' };
    }
    async rsvp(id, data) {
        return this.prisma.guest.update({
            where: { id },
            data: {
                status: data.status,
            },
        });
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GuestService);
//# sourceMappingURL=guest.service.js.map