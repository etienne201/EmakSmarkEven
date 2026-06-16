import { Storage } from "../storage/storage";
import { TableSchema } from "@backend/validations/table.schema";
import { AppError } from "@backend/middleware/error-handler";

export class TableService {
  static async getTables(ownerId: string) {
    return Storage.getTables(ownerId);
  }

  static async saveTables(ownerId: string, tables: any[]) {
    await Storage.saveTables(tables, ownerId);
    return tables;
  }

  static async createTable(ownerId: string, data: any) {
    const validated = TableSchema.parse(data);
    const tables = await Storage.getTables(ownerId);
    
    const newTable = {
      id: validated.id || `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: validated.name,
      number: (validated as any).number || 0,
      capacity: validated.capacity || 10,
      guests: []
    };
    
    tables.push(newTable);
    await Storage.saveTables(tables, ownerId);
    return newTable;
  }

  static async updateTable(ownerId: string, tableId: string, data: any) {
    const tables = await Storage.getTables(ownerId);
    const idx = tables.findIndex((t: any) => t.id === tableId);
    if (idx !== -1) {
      tables[idx] = { ...tables[idx], ...data };
      await Storage.saveTables(tables, ownerId);
      return tables[idx];
    }
    throw new AppError("Table not found", 404);
  }

  static async deleteTable(ownerId: string, tableId: string) {
    const tables = await Storage.getTables(ownerId);
    const filtered = tables.filter((t: any) => t.id !== tableId);
    await Storage.saveTables(filtered, ownerId);
    return { success: true };
  }
}
