import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NetworkingService {
  constructor(private prisma: PrismaService) {}

  async getConnections(eventId: string) {
    return this.prisma.conversation.findMany({
      where: { eventId },
      include: { participants: true },
    });
  }

  async createConnection(eventId: string, guestIds: string[]) {
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

  async getMatches(eventId: string, guestId: string) {
    // Basic implementation using conversations where the guest is participant
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

  async getChatHistory(conversationId: string) {
    return this.prisma.conversationMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(conversationId: string, senderGuestId: string, content: string) {
    return this.prisma.conversationMessage.create({
      data: {
        conversationId,
        senderGuestId,
        content,
      },
    });
  }
}
