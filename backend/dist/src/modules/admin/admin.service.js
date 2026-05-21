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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getEventStats(eventId) {
        const totalGuests = await this.prisma.guest.count({ where: { eventId } });
        const confirmedGuests = await this.prisma.guest.count({ where: { eventId, status: 'confirmed' } });
        const checkedInGuests = await this.prisma.guest.count({ where: { eventId, status: 'checked_in' } });
        return { totalGuests, confirmedGuests, checkedInGuests };
    }
    async getGuests(eventId) {
        return this.prisma.guest.findMany({
            where: { eventId },
            include: { ticket: true },
        });
    }
    async updateEventConfig(eventId, data) {
        return this.prisma.event.update({
            where: { id: eventId },
            data,
        });
    }
    async addGuest(eventId, guestData) {
        return this.prisma.guest.create({
            data: {
                ...guestData,
                eventId,
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map