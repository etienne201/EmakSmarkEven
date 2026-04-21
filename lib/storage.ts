import { kv } from "@vercel/kv";
import fs from "fs";
import path from "path";

// Fallback arrays for local development when KV is not configured
let localGuests: any[] = [];
let localAttendance: any[] = [];
let localTables: any[] = [];

// Determine if we are in a production environment with KV enabled
const isProd = process.env.NODE_ENV === "production";
const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

if (isProd) {
  console.log(hasKV ? "🚀 Production: Vercel KV Active" : "⚠️ Production Warning: No KV detected, using temporary memory!");
}

// Local fallback initialization (Only for dev)
if (!isProd) {
  try {
    const GUEST_FILE = path.join(process.cwd(), "lib", "guests.json");
    if (fs.existsSync(GUEST_FILE)) {
      localGuests = JSON.parse(fs.readFileSync(GUEST_FILE, "utf-8"));
    }
  } catch (e) {
    console.warn("Storage: Could not load local guests.", e);
  }
}

export const Storage = {
  async getGuests(): Promise<any[]> {
    if (hasKV) {
      try {
        return (await kv.get("mariage:guests")) || [];
      } catch (e) {
        console.error("KV Error (getGuests):", e);
      }
    }
    return localGuests;
  },

  async saveGuests(guests: any[]) {
    if (hasKV) {
      try {
        await kv.set("mariage:guests", guests);
      } catch (e) {
        console.error("KV Error (saveGuests):", e);
      }
    }
    
    localGuests = guests;
    
    // Explicitly persist to file only in development
    if (process.env.NODE_ENV === "development") {
      try {
        const GUEST_FILE = path.join(process.cwd(), "lib", "guests.json");
        fs.writeFileSync(GUEST_FILE, JSON.stringify(guests, null, 2));
      } catch (e) {
        console.warn("Storage: Could not persist guests to disk.", e);
      }
    }
  },

  async getAttendance(): Promise<any[]> {
    if (hasKV) {
      try {
        return (await kv.get("mariage:attendance")) || [];
      } catch (e) {
        console.error("KV Error (getAttendance):", e);
      }
    }
    return localAttendance;
  },

  async saveAttendance(attendance: any[]) {
    if (hasKV) {
      try {
        await kv.set("mariage:attendance", attendance);
      } catch (e) {
        console.error("KV Error (saveAttendance):", e);
      }
    }
    
    localAttendance = attendance;

    if (process.env.NODE_ENV === "development") {
      try {
        const ATT_FILE = path.join(process.cwd(), "lib", "attendance.json");
        fs.writeFileSync(ATT_FILE, JSON.stringify(attendance, null, 2));
      } catch (e) {
        console.warn("Storage: Could not persist attendance to disk.", e);
      }
    }
  },

  async getTables(): Promise<any[]> {
    if (hasKV) {
      try {
        return (await kv.get("mariage:tables")) || [];
      } catch (e) {
        console.error("KV Error (getTables):", e);
      }
    }
    return localTables;
  },

  async saveTables(tables: any[]) {
    if (hasKV) {
      try {
        await kv.set("mariage:tables", tables);
      } catch (e) {
        console.error("KV Error (saveTables):", e);
      }
    }
    localTables = tables;
  },

  async clearAllData() {
    if (hasKV) {
      await kv.del("mariage:guests");
      await kv.del("mariage:attendance");
      await kv.del("mariage:tables");
    }
    localGuests = [];
    localAttendance = [];
    localTables = [];
  },

  async deleteGuest(id: string | number) {
    const stringId = id.toString();
    const guests = await this.getGuests();
    const filteredGuests = guests.filter((g: any) => g.id.toString() !== stringId);
    await this.saveGuests(filteredGuests);

    const attendance = await this.getAttendance();
    const filteredAttendance = attendance.filter((a: any) => a.guestId.toString() !== stringId);
    await this.saveAttendance(filteredAttendance);
  },

  async isGuestPresent(id: string | number): Promise<string | null> {
    const stringId = id.toString();
    const attendance = await this.getAttendance();
    const record = attendance.find((a: any) => a.guestId.toString() === stringId);
    return record ? record.status : null;
  }
};
