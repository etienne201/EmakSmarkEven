// Final Production Storage Engine - Refreshed 2026-05-05
import fs from "fs";
import path from "path";

// Support for different Vercel prefixes (standard KV_ or custom STORAGE_)
const kvUrl = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;
const redisUrl = process.env.REDIS_URL;

// --- SENIOR SINGLETON PATTERN ---
let cachedClient: any = null;
let kvFailed = false;
let redisFailed = false;

async function getClient() {
  if (kvFailed && redisFailed) return null;
  if (cachedClient) return cachedClient;

  try {
    // 1. Priority: External Redis (RedisLabs)
    if (redisUrl && !redisFailed) {
      console.log("📡 Initializing RedisLabs Client (Dynamic)...");
      try {
        const { createClient: createRedis } = await import("redis");
        const client = createRedis({ 
          url: redisUrl,
          socket: { connectTimeout: 1500 } 
        });
        
        const connectPromise = client.connect();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
        
        await Promise.race([connectPromise, timeoutPromise]);
        
        cachedClient = {
          get: (k: string) => client.get(k),
          set: (k: string, v: string) => client.set(k, v),
          del: (k: string) => client.del(k),
          sadd: (k: string, v: string) => client.sAdd(k, v),
          smembers: (k: string) => client.sMembers(k),
          srem: (k: string, v: string) => client.sRem(k, v),
          lpush: (k: string, v: string) => client.lPush(k, v),
          lrange: (k: string, s: number, e: number) => client.lRange(k, s, e),
          ltrim: (k: string, s: number, e: number) => client.lTrim(k, s, e),
          isWrapped: true,
          type: 'redis'
        };
        return cachedClient;
      } catch (redisErr) {
        console.error("❌ RedisLabs Connection Failed (Switching to KV or Local)");
        redisFailed = true;
      }
    }

    // 2. Fallback: Vercel KV
    if (kvUrl && kvToken && !kvFailed) {
      console.log("🚀 Initializing Vercel KV Client (Dynamic)...");
      try {
        const { createClient: createVercelKV } = await import("@vercel/kv");
        const client = createVercelKV({ url: kvUrl, token: kvToken });
        // Test connection immediately to avoid fetch errors later
        await client.set("healthcheck", Date.now().toString());
        cachedClient = client;
        (cachedClient as any).type = 'kv';
        return cachedClient;
      } catch (kvErr) {
        console.error("❌ Vercel KV Connection Failed (Switching to Local)");
        kvFailed = true;
      }
    }
  } catch (err) {
    console.error("❌ Storage Initialization Error:", err);
  }

  return null;
}

function handleCloudError(e: any) {
  const msg = e?.message || String(e);
  if (msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("Timeout")) {
    console.error("⚠️ Cloud Storage unreachable, falling back to Local definitively.");
    cachedClient = null;
    kvFailed = true;
    redisFailed = true;
  } else {
    console.error("Cloud Storage Error:", e);
  }
}

// Local Fallback Helpers
const DATA_DIR = path.join(process.cwd(), "src", "backend", "data", "storage_local");
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
}

function getLocalPath(ownerId: string, type: string) {
  return path.join(DATA_DIR, `${type}_${ownerId}.json`);
}

function readLocal(ownerId: string, type: string, defaultValue: any) {
  try {
    const p = getLocalPath(ownerId, type);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    }
  } catch {}
  return defaultValue;
}

function writeLocal(ownerId: string, type: string, data: any) {
  try {
    const p = getLocalPath(ownerId, type);
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
  } catch {}
}

export const Storage = {
  async getGuests(ownerId: string = "default"): Promise<any[]> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get(`event:${ownerId}:guests`);
        if (data) return (typeof data === "string" ? JSON.parse(data) : data);
      } catch (e) {
        handleCloudError(e);
      }
    }
    return readLocal(ownerId, "guests", []);
  },

  async saveGuests(guests: any[], ownerId: string = "default") {
    const client = await getClient();
    if (client) {
      try {
        const value = client.isWrapped ? JSON.stringify(guests) : guests;
        await client.set(`event:${ownerId}:guests`, value);
      } catch (e) {
        handleCloudError(e);
      }
    }
    writeLocal(ownerId, "guests", guests);
  },

  async getAttendance(ownerId: string = "default"): Promise<any[]> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get(`event:${ownerId}:attendance`);
        if (data) return (typeof data === "string" ? JSON.parse(data) : data);
      } catch (e) {
        handleCloudError(e);
      }
    }
    return readLocal(ownerId, "attendance", []);
  },

  async saveAttendance(attendance: any[], ownerId: string = "default") {
    const client = await getClient();
    if (client) {
      try {
        const value = client.isWrapped ? JSON.stringify(attendance) : attendance;
        await client.set(`event:${ownerId}:attendance`, value);
      } catch (e) {
        handleCloudError(e);
      }
    }
    writeLocal(ownerId, "attendance", attendance);
  },

  async getTables(ownerId: string = "default"): Promise<any[]> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get(`event:${ownerId}:tables`);
        if (data) return (typeof data === "string" ? JSON.parse(data) : data);
      } catch (e) {
        handleCloudError(e);
      }
    }
    return readLocal(ownerId, "tables", []);
  },

  async saveTables(tables: any[], ownerId: string = "default") {
    const client = await getClient();
    if (client) {
      try {
        const value = client.isWrapped ? JSON.stringify(tables) : tables;
        await client.set(`event:${ownerId}:tables`, value);
      } catch (e) {
        handleCloudError(e);
      }
    }
    writeLocal(ownerId, "tables", tables);
  },

  async getEventConfig(ownerId: string = "default"): Promise<any | null> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get(`event:config:${ownerId}`);
        if (data) return (typeof data === "string" ? JSON.parse(data) : data);
      } catch (e) {
        handleCloudError(e);
      }
    }
    const local = readLocal(ownerId, "config", null);
    if (!local && (ownerId === "default" || ownerId === "UserEven")) {
      const { DEFAULT_EVENT_CONFIG } = await import("@backend/eventConfig");
      return { ...DEFAULT_EVENT_CONFIG, ownerId };
    }
    return local;
  },

  async saveEventConfig(config: any) {
    const ownerId = config.ownerId || "default";
    const client = await getClient();
    if (client) {
      try {
        const value = client.isWrapped ? JSON.stringify(config) : config;
        await client.set(`event:config:${ownerId}`, value);
        await client.sadd("event:all_owners", ownerId);
      } catch (e) {
        handleCloudError(e);
      }
    }
    writeLocal(ownerId, "config", config);
    
    // Also track all owners locally
    const owners = readLocal("global", "owners", []);
    if (!owners.includes(ownerId)) {
      owners.push(ownerId);
      writeLocal("global", "owners", owners);
    }
  },

  async getAllEventConfigs(): Promise<any[]> {
    const client = await getClient();
    let owners = [];
    
    if (client) {
      try {
        owners = await client.smembers("event:all_owners");
      } catch (e) {
        handleCloudError(e);
      }
    }
    
    if (!owners || owners.length === 0) {
      owners = readLocal("global", "owners", []);
    }

    // Always include bootstrap accounts if they are not already there
    const bootstrap = ["default", "UserEven"];
    bootstrap.forEach(id => {
      if (!owners.includes(id)) owners.push(id);
    });

    const configs = await Promise.all(owners.map(async (o: string) => {
      const config = await this.getEventConfig(o);
      if (!config) return null;
      
      const guests = await this.getGuests(o);
      const attendance = await this.getAttendance(o);
      
      return {
        ...config,
        stats: {
          totalGuests: guests.length,
          presentCount: attendance.filter((a: any) => a.status === "Présent" || a.status === "Honoré").length
        }
      };
    }));
    return configs.filter(c => c !== null);
  },

  async deleteEventConfig(ownerId: string) {
    const client = await getClient();
    if (client) {
      try {
        await client.del(`event:config:${ownerId}`);
        await client.srem("event:all_owners", ownerId);
      } catch (e) {
        handleCloudError(e);
      }
    }
    // Delete local
    try {
      fs.unlinkSync(getLocalPath(ownerId, "config"));
      const owners = readLocal("global", "owners", []);
      writeLocal("global", "owners", owners.filter((o: string) => o !== ownerId));
    } catch {}
  },

  // --- ADMIN (TENANT) MANAGEMENT ---
  async getAdmins(): Promise<any[]> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get("global:admins");
        if (data) return (typeof data === "string" ? JSON.parse(data) : data);
      } catch (e) {
        handleCloudError(e);
      }
    }
    return readLocal("global", "admins", []);
  },

  async saveAdmins(admins: any[]) {
    const client = await getClient();
    if (client) {
      try {
        const value = client.isWrapped ? JSON.stringify(admins) : admins;
        await client.set("global:admins", value);
      } catch (e) {
        handleCloudError(e);
      }
    }
    writeLocal("global", "admins", admins);
  },

  async getAdminById(adminId: string): Promise<any | null> {
    const admins = await this.getAdmins();
    return admins.find((a: any) => a.id === adminId) || null;
  },

  // --- SETUP WIZARD STATE ---
  async getSetupState(ownerId: string): Promise<any | null> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.get(`setup:state:${ownerId}`);
        if (data) return (typeof data === "string" ? JSON.parse(data) : data);
      } catch (e) {
        handleCloudError(e);
      }
    }
    return readLocal(ownerId, "setup_state", null);
  },

  async saveSetupState(ownerId: string, state: any) {
    const client = await getClient();
    if (client) {
      try {
        const value = client.isWrapped ? JSON.stringify(state) : state;
        await client.set(`setup:state:${ownerId}`, value);
      } catch (e) {
        handleCloudError(e);
      }
    }
    writeLocal(ownerId, "setup_state", state);
  },

  // --- LOGS ENHANCEMENT ---
  async saveLog(ownerId: string, action: string, details: any = {}) {
    const client = await getClient();
    const log = { 
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(), 
      ownerId, 
      action, 
      details 
    };
    
    if (client) {
      try {
        await client.lpush(`logs:${ownerId}`, JSON.stringify(log));
        await client.ltrim(`logs:${ownerId}`, 0, 999);
        await client.lpush("logs:global", JSON.stringify(log));
        await client.ltrim("logs:global", 0, 4999);
      } catch (e) {
        handleCloudError(e);
      }
    }
    const logs = readLocal(ownerId, "logs", []);
    logs.unshift(log);
    writeLocal(ownerId, "logs", logs.slice(0, 500));
  },

  async getLogs(ownerId: string = "global", limit: number = 100): Promise<any[]> {
    const client = await getClient();
    if (client) {
      try {
        const data = await client.lrange(`logs:${ownerId}`, 0, limit - 1);
        if (data) return data.map((d: string) => JSON.parse(d));
      } catch (e) {
        handleCloudError(e);
      }
    }
    const localLogs = readLocal(ownerId, "logs", []);
    return localLogs.slice(0, limit);
  },

  // --- STATS ---
  async getGlobalStats(): Promise<any> {
    const admins = await this.getAdmins();
    const owners = readLocal("global", "owners", []);
    
    return {
      total_admins: admins.length,
      active_admins: admins.filter((a: any) => a.status === "active").length,
      blocked_admins: admins.filter((a: any) => a.status === "blocked").length,
      total_events: owners.length,
    };
  },

  async getEventStats(ownerId: string): Promise<any> {
    const guests = await this.getGuests(ownerId);
    const attendance = await this.getAttendance(ownerId);
    const tables = await this.getTables(ownerId);
    
    const rsvp_confirmed = guests.filter((g: any) => g.rsvpStatus === "confirmed").length;
    const rsvp_declined = guests.filter((g: any) => g.rsvpStatus === "declined").length;
    const rsvp_pending = guests.filter((g: any) => !g.rsvpStatus || g.rsvpStatus === "pending").length;
    const checked_in = attendance.length;
    
    return {
      total_guests: guests.length,
      rsvp_confirmed,
      rsvp_declined,
      rsvp_pending,
      checked_in,
      attendance_rate: guests.length > 0 ? (checked_in / guests.length) * 100 : 0,
      tables_total: tables.length,
      tables_filled: tables.filter((t: any) => (t.guests?.length || 0) >= t.capacity).length
    };
  },

  async isGuestPresent(guestId: string, ownerId: string = "default"): Promise<boolean> {
    const attendance = await this.getAttendance(ownerId);
    return attendance.some((a: any) => a.guestId.toString() === guestId.toString());
  },

  async deleteGuest(id: string, ownerId: string = "default") {
    const guests = await this.getGuests(ownerId);
    const updated = guests.filter((g: any) => g.id.toString() !== id.toString());
    await this.saveGuests(updated, ownerId);
  },

  async clearAllData(ownerId: string = "default") {
    await this.saveGuests([], ownerId);
    await this.saveAttendance([], ownerId);
    await this.saveTables([], ownerId);
  },

  async deleteEvent(ownerId: string): Promise<void> {
    const client = await getClient();
    if (client) {
      await client.del(`event:${ownerId}:config`);
      await client.del(`event:${ownerId}:guests`);
      await client.del(`event:${ownerId}:attendance`);
      await client.del(`event:${ownerId}:tables`);
      await client.del(`event:${ownerId}:logs`);
      await client.del(`event:${ownerId}:setup`);
    }
    
    // Always clear local
    writeLocal(ownerId, "guests", []);
    writeLocal(ownerId, "attendance", []);
    writeLocal(ownerId, "tables", []);
    writeLocal(ownerId, "config", null);
    
    // Remove from admins list
    const admins = await this.getAdmins();
    const updated = admins.filter((a: any) => a.id !== ownerId);
    await this.saveAdmins(updated);
  }
};


