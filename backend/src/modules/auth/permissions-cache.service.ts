import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PermissionsCacheService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, { value: any; expires: number }>();
  private readonly logger = new Logger(PermissionsCacheService.name);
  private lastLoggedErrors = new Map<string, number>();

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private logErrorThrottle(message: string, error?: any) {
    const now = Date.now();
    const lastLogged = this.lastLoggedErrors.get(message) || 0;
    if (now - lastLogged > 120000) { // Limit identical logs to once every 2 minutes
      this.lastLoggedErrors.set(message, now);
      if (error?.stack) {
        this.logger.error(message, error.stack);
      } else {
        this.logger.error(message);
      }
    }
  }

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL || process.env.KV_URL;
    if (redisUrl) {
      try {
        this.logger.log(`Connecting to Redis: ${redisUrl.split('@').pop()}`);
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 2000,
          enableOfflineQueue: false,
        });
        
        this.redis.on('error', (err) => {
          this.logErrorThrottle(`Redis Error: ${err.message}`);
        });

        this.redis.on('connect', () => {
          this.logger.log('Successfully connected to Redis database.');
          this.lastLoggedErrors.clear(); // Reset throttled logs when connection succeeds
        });
      } catch (err: any) {
        this.logger.error(`Failed to initialize Redis client: ${err.message}`);
      }
    } else {
      this.logger.warn('No REDIS_URL or KV_URL found. Caching will use in-memory fallback.');
    }
  }

  onModuleDestroy() {
    if (this.redis) {
      this.redis.disconnect();
    }
  }

  async get(key: string): Promise<any> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        const val = await this.redis.get(key);
        if (val) return JSON.parse(val);
      } catch (err: any) {
        this.logErrorThrottle(`Redis get error: ${err.message}`);
      }
    }
    // Memory fallback
    const item = this.memoryCache.get(key);
    if (item && item.expires > Date.now()) {
      return item.value;
    }
    return null;
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err: any) {
        this.logErrorThrottle(`Redis set error: ${err.message}`);
      }
    }
    // Memory fallback
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.del(key);
        return;
      } catch (err: any) {
        this.logErrorThrottle(`Redis del error: ${err.message}`);
      }
    }
    this.memoryCache.delete(key);
  }

  async delMultiple(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.del(...keys);
        return;
      } catch (err: any) {
        this.logErrorThrottle(`Redis del multiple error: ${err.message}`);
      }
    }
    keys.forEach(k => this.memoryCache.delete(k));
  }

  /**
   * Invalidates permissions cache for a single user.
   */
  async invalidateUser(userId: string): Promise<void> {
    const key = `user:permissions:${userId}`;
    this.logger.log(`Invalidating permissions cache for user ID: ${userId}`);
    await this.del(key);
  }

  /**
   * Invalidates permissions cache for all users sharing a given role name.
   */
  async invalidateRole(roleName: string): Promise<void> {
    this.logger.log(`Invalidating permissions cache for all users with role: ${roleName}`);
    try {
      const users = await this.prisma.user.findMany({
        where: {
          role: {
            name: {
              equals: roleName,
              mode: 'insensitive',
            },
          },
        },
        select: { id: true },
      });

      const keys = users.map((u) => `user:permissions:${u.id}`);
      if (keys.length > 0) {
        await this.delMultiple(keys);
        this.logger.log(`Invalidated ${keys.length} users' cache.`);
      }
    } catch (err: any) {
      this.logErrorThrottle(`Failed to invalidate role cache: ${err.message}`);
    }
  }
}
