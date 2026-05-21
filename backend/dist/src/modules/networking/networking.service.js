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
exports.NetworkingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let NetworkingService = class NetworkingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConnections(eventId) {
        return this.prisma.conversation.findMany({
            where: { eventId },
            include: { participants: true },
        });
    }
    async createConnection(eventId, guestIds) {
        const conversation = await this.prisma.conversation.create({
            data: {
                eventId,
                participants: {
                    create: guestIds.map(id => ({ guestId: id }))
                }
            }
        });
        return conversation;
    }
    async getMatches(eventId, guestId) {
        return this.prisma.conversation.findMany({
            where: {
                eventId,
                participants: {
                    some: { guestId }
                }
            },
            include: { participants: true }
        });
    }
    async getChatHistory(conversationId) {
        return this.prisma.conversationMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendMessage(conversationId, senderGuestId, content) {
        return this.prisma.conversationMessage.create({
            data: {
                conversationId,
                senderGuestId,
                content,
            },
        });
    }
};
exports.NetworkingService = NetworkingService;
exports.NetworkingService = NetworkingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NetworkingService);
//# sourceMappingURL=networking.service.js.map