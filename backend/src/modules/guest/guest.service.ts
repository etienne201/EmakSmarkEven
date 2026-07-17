import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

function mapGuest(g: any) {
  if (!g) return g;
  const meta = typeof g.metadata === 'object' && g.metadata ? g.metadata : {};
  return {
    ...g,
    ...meta,
    name: meta.name || g.fullName || "",
    tableName: meta.tableName || (meta.table ? `Table ${meta.table}` : "Non assigné"),
    table: meta.table || 0,
    title: meta.title || "M./Mme",
    lang: meta.lang || "fr",
  };
}

function packageGuestData(data: any) {
  const {
    id,
    eventId,
    fullName,
    email,
    phone,
    guestRole,
    status,
    guestType,
    qrCode,
    invitationUrl,
    ticketId,
    createdAt,
    updatedAt,
    metadata,
    ...rest
  } = data;

  return {
    id,
    eventId,
    fullName: fullName || rest.name || "",
    email,
    phone,
    guestRole,
    status,
    guestType,
    qrCode,
    invitationUrl,
    ticketId,
    metadata: {
      ...(metadata || {}),
      ...rest,
    },
  };
}

@Injectable()
export class GuestService {
  constructor(private prisma: PrismaService) {}

  async findAll(eventId: string) {
    const list = await this.prisma.guest.findMany({
      where: { eventId },
    });
    return list.map(mapGuest);
  }

  async findOne(id: string) {
    const g = await this.prisma.guest.findUnique({
      where: { id },
    });
    return mapGuest(g);
  }

  async create(data: any) {
    const prismaData = packageGuestData(data);
    const created = await this.prisma.guest.create({
      data: prismaData,
    });
    return mapGuest(created);
  }

  async update(id: string, data: any) {
    const prismaData = packageGuestData(data);
    delete prismaData.id;
    delete prismaData.eventId;

    const updated = await this.prisma.guest.update({
      where: { id },
      data: prismaData,
    });
    return mapGuest(updated);
  }

  async remove(id: string) {
    const deleted = await this.prisma.guest.delete({
      where: { id },
    });
    return mapGuest(deleted);
  }

  async importGuests(eventId: string, file: any) {
    // Logic for CSV/Excel import
    return { imported: 0 };
  }

  async exportGuests(eventId: string) {
    // Logic for CSV/Excel export
    return { url: 'link-to-file' };
  }

  async rsvp(id: string, data: any) {
    const updated = await this.prisma.guest.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
    return mapGuest(updated);
  }

  async createCheckin(guestId: string, status: string = 'Présent') {
    const guest = await this.prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      throw new Error(`Guest with ID ${guestId} not found`);
    }

    const checkin = await this.prisma.guestCheckin.create({
      data: {
        guestId,
        metadata: { status },
      },
    });

    await this.prisma.guest.update({
      where: { id: guestId },
      data: {
        status: 'checked_in',
      },
    });

    return {
      guestId,
      name: guest.fullName,
      status,
      timestamp: checkin.scannedAt,
    };
  }

  async findCheckins(eventId: string) {
    const list = await this.prisma.guestCheckin.findMany({
      where: {
        guest: {
          eventId,
        },
      },
      include: {
        guest: true,
      },
      orderBy: {
        scannedAt: 'desc',
      },
    });

    return list.map((c) => {
      const g = c.guest;
      const meta = typeof g.metadata === 'object' && g.metadata ? (g.metadata as Record<string, any>) : {};
      const checkinMeta = typeof c.metadata === 'object' && c.metadata ? (c.metadata as Record<string, any>) : {};
      
      return {
        guestId: c.guestId,
        name: meta.name || g.fullName || "",
        status: checkinMeta.status || "Présent",
        tableNumber: meta.table || 0,
        tableName: meta.tableName || (meta.table ? `Table ${meta.table}` : "Non assigné"),
        timestamp: c.scannedAt.toISOString(),
      };
    });
  }
}

