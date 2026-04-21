// Final Production Storage Engine - Refreshed 2026-04-21
import fs from "fs";
import path from "path";

// Support for different Vercel prefixes (standard KV_ or custom STORAGE_)
const kvUrl = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;
const redisUrl = process.env.REDIS_URL;

// --- SENIOR SINGLETON PATTERN ---
let cachedClient: any = null;

async function getClient() {
  if (cachedClient) return cachedClient;

  try {
    // 1. Priority: External Redis (RedisLabs)
    if (redisUrl) {
      console.log("📡 Initializing RedisLabs Client (Dynamic)...");
      const { createClient: createRedis } = await import("redis");
      const client = createRedis({ url: redisUrl });
      await client.connect();
      cachedClient = client;
      return cachedClient;
    }

    // 2. Fallback: Vercel KV
    if (kvUrl && kvToken) {
      console.log("🚀 Initializing Vercel KV Client (Dynamic)...");
      const { createClient: createVercelKV } = await import("@vercel/kv");
      cachedClient = createVercelKV({ url: kvUrl, token: kvToken });
      return cachedClient;
    }
  } catch (err) {
    console.error("❌ Storage Initialization Error:", err);
  }

  return null;
}

const isProd = process.env.NODE_ENV === "production";

// Fallback arrays for local development
let localGuests: any[] = [];
let localAttendance: any[] = [];
let localTables: any[] = [];

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
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get("mariage:guests");
        return (typeof data === "string" ? JSON.parse(data) : data) || [];
      } catch (e) {
        console.error("Storage Error (getGuests):", e);
      }
    }
    return localGuests;
  },

  async saveGuests(guests: any[]) {
    const client = await getClient();
    if (client) {
      try {
        // Handle serialization differences between redis and vercel/kv
        const value = typeof client.set === "function" && client.connect ? JSON.stringify(guests) : guests;
        await client.set("mariage:guests", value);
      } catch (e) {
        console.error("Storage Error (saveGuests):", e);
      }
    }

    localGuests = guests;

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
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get("mariage:attendance");
        return (typeof data === "string" ? JSON.parse(data) : data) || [];
      } catch (e) {
        console.error("Storage Error (getAttendance):", e);
      }
    }
    return localAttendance;
  },

  async saveAttendance(attendance: any[]) {
    const client = await getClient();
    if (client) {
      try {
        const value = typeof client.set === "function" && client.connect ? JSON.stringify(attendance) : attendance;
        await client.set("mariage:attendance", value);
      } catch (e) {
        console.error("Storage Error (saveAttendance):", e);
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
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get("mariage:tables");
        return (typeof data === "string" ? JSON.parse(data) : data) || [];
      } catch (e) {
        console.error("Storage Error (getTables):", e);
      }
    }
    return localTables;
  },

  async saveTables(tables: any[]) {
    const client = await getClient();
    if (client) {
      try {
        const value = typeof client.set === "function" && client.connect ? JSON.stringify(tables) : tables;
        await client.set("mariage:tables", value);
      } catch (e) {
        console.error("Storage Error (saveTables):", e);
      }
    }
    localTables = tables;
  },

  async clearAllData() {
    const client = await getClient();
    if (client) {
      await client.del("mariage:guests");
      await client.del("mariage:attendance");
      await client.del("mariage:tables");
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
