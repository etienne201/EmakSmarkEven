import { prisma } from "../prisma";
import { TableSchema } from "@backend/validations/table.schema";
import { AppError } from "@backend/middleware/error-handler";

export class TableService {
  static async getTables(ownerId: string) {
    return prisma.table.findMany({
      where: {
        event: { adminId: ownerId }
      },
      include: {
        guests: true
      },
      orderBy: { name: 'asc' }
    });
  }

  static async saveTables(ownerId: string, tables: any[]) {
    const event = await prisma.event.findFirst({ where: { adminId: ownerId } });
    if (!event) throw new AppError("No event found.", 404);

    const results = [];
    for (const table of tables) {
      // If the ID is a valid UUID, we try to update, otherwise we create
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(table.id);
      
      if (isUuid) {
        const updated = await prisma.table.upsert({
          where: { id: table.id },
          update: {
            name: table.name,
            number: (table as any).number || 0,
            capacity: table.capacity || 10
          } as any,
          create: {
            id: table.id,
            eventId: event.id,
            name: table.name,
            number: (table as any).number || 0,
            capacity: table.capacity || 10
          } as any
        });
        results.push(updated);
      } else {
        const created = await prisma.table.create({
          data: {
            eventId: event.id,
            name: table.name,
            number: (table as any).number || 0,
            capacity: table.capacity || 10
          } as any
        });
        results.push(created);
      }
    }
    return results;
  }

  static async createTable(ownerId: string, data: any) {
    const validated = TableSchema.parse(data);
    
    const event = await prisma.event.findFirst({
      where: { adminId: ownerId }
    });

    if (!event) {
      throw new AppError("No event found. Create an event first.", 404);
    }

    return prisma.table.create({
      data: {
        eventId: event.id,
        name: validated.name,
        number: (validated as any).number || 0,
        capacity: validated.capacity || 10,
      } as any
    });
  }

  static async updateTable(ownerId: string, tableId: string, data: any) {
    return prisma.table.update({
      where: { 
        id: tableId,
        event: { adminId: ownerId }
      },
      data: {
        name: data.name,
        number: (data as any).number,
        capacity: data.capacity
      } as any
    });
  }

  static async deleteTable(ownerId: string, tableId: string) {
    return prisma.table.delete({
      where: { 
        id: tableId,
        event: { adminId: ownerId }
      }
    });
  }
}
