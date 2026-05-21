import { prisma } from "@backend/prisma";

export type ActorType = "admin" | "super_admin" | "system";

export class LogService {
  /**
   * Enregistre une action dans le journal d'activité (append-only).
   * @param actorId   - UID Firebase ou ID admin
   * @param actorType - admin | super_admin | system
   * @param action    - ex: 'guest:created', 'event:finalized'
   * @param opts      - Champs optionnels (actorName, targetType, targetId, details, ipAddress)
   */
  static async saveLog(
    actorId: string,
    actorType: ActorType,
    action: string,
    opts: {
      actorName?: string;
      targetType?: string;
      targetId?: string;
      details?: Record<string, any>;
      ipAddress?: string;
      adminId?: string | null;
    } = {}
  ) {
    try {
      return await prisma.activityLog.create({
        data: {
          actorId,
          actorType,
          actorName: opts.actorName || null,
          action,
          targetType: opts.targetType || null,
          targetId: opts.targetId || null,
          details: (opts.details as any) || null,
          ipAddress: opts.ipAddress || null,
          // adminId is optional FK – only set if it's a known admin ID
          adminId: opts.adminId || null,
        }
      });
    } catch (error) {
      // Ne bloque jamais le thread principal
      console.error("[LogService] Error saving activity log:", error);
      return null;
    }
  }

  /**
   * Shorthand pour les actions système (ex: sync, cron)
   */
  static async system(action: string, details?: Record<string, any>) {
    return LogService.saveLog("system", "system", action, { details });
  }
}
