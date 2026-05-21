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
exports.DesignService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let DesignService = class DesignService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findEventThemes(eventId) {
        return this.prisma.eventTheme.findMany({ where: { eventId } });
    }
    async findOneTheme(id) {
        return this.prisma.eventTheme.findUnique({ where: { id } });
    }
    async createEventTheme(eventId, data) {
        return this.prisma.eventTheme.create({
            data: { ...data, eventId },
        });
    }
    async updateEventTheme(id, data) {
        return this.prisma.eventTheme.update({
            where: { id },
            data,
        });
    }
    async deleteEventTheme(id) {
        return this.prisma.eventTheme.delete({ where: { id } });
    }
    async getEventDesign(eventId) {
        return this.prisma.eventContent.findUnique({
            where: { eventId },
        });
    }
    async updateEventDesign(eventId, data) {
        return this.prisma.eventContent.upsert({
            where: { eventId },
            update: data,
            create: { ...data, eventId },
        });
    }
    async getAssets(eventId) {
        return this.prisma.eventAsset.findMany({
            where: { eventId },
        });
    }
    async createAsset(eventId, data) {
        return this.prisma.eventAsset.create({
            data: { ...data, eventId },
        });
    }
};
exports.DesignService = DesignService;
exports.DesignService = DesignService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DesignService);
//# sourceMappingURL=design.service.js.map