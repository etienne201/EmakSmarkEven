import { Storage } from "../storage/storage";
import { AppError } from "../middleware/error-handler";
import { createToken } from "../auth";
import { adminAuth } from "../firebase-admin";
import { MailService } from "./mail.service";

export class AdminService {
  /* ---------------------------
   * SYNC FIREBASE USER
   * --------------------------*/
  static async syncFirebaseUser(uid: string, email?: string, name?: string) {
    const admins = await Storage.getAdmins();
    const idx = admins.findIndex((a: any) => a.id === uid);

    if (idx === -1) {
      throw new AppError(
        "Accès refusé. Compte non autorisé.",
        403
      );
    }

    admins[idx].email = email || admins[idx].email;
    admins[idx].name = name || admins[idx].name;
    admins[idx].lastLoginAt = new Date().toISOString();

    await Storage.saveAdmins(admins);
    return admins[idx];
  }

  /* ---------------------------
   * ADMIN LOGIN
   * --------------------------*/
  static async adminLogin(eventIdOrEmail: string, password: string) {
    const admins = await Storage.getAdmins();

    const admin = admins.find(
      (a: any) =>
        a.eventId === eventIdOrEmail || a.email === eventIdOrEmail
    );

    const SA_EMAIL =
      process.env.SUPERADMIN_EMAIL ||
      process.env.SUPER_ADMIN_EMAIL ||
      "superadmin@smartevent.com";

    const SA_PASSWORD =
      process.env.SUPERADMIN_PASSWORD ||
      process.env.SUPER_ADMIN_PASSWORD ||
      "Superadmin123@";

    // 🔥 SUPER ADMIN FALLBACK
    if (!admin || admin.passwordHash !== password) {
      if (eventIdOrEmail === SA_EMAIL && password === SA_PASSWORD) {
        const payload = {
          uid: "super-admin-root",
          role: "super-admin",
          email: SA_EMAIL,
          ownerId: "system",
        };

        const accessToken = await createToken(payload);
        const refreshToken = `rt_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}`;

        return { user: payload, accessToken, refreshToken };
      }

      throw new AppError("Invalid credentials", 401);
    }

    const payload = {
      uid: admin.id,
      ownerId: admin.id,
      role: "admin",
      email: admin.email,
      name: admin.name,
    };

    const accessToken = await createToken(payload);
    const refreshToken = `rt_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    admin.lastLoginAt = new Date().toISOString();
    await Storage.saveAdmins(admins);

    return { user: payload, accessToken, refreshToken };
  }

  /* ---------------------------
   * SUPER ADMIN LOGIN
   * --------------------------*/
  static async superAdminLogin(
    email: string,
    password: string,
    totp?: string
  ) {
    const SA_EMAIL =
      process.env.SUPERADMIN_EMAIL ||
      process.env.SUPER_ADMIN_EMAIL ||
      "superadmin@smartevent.com";

    const SA_PASSWORD =
      process.env.SUPERADMIN_PASSWORD ||
      process.env.SUPER_ADMIN_PASSWORD ||
      "Superadmin123@";

    if (email !== SA_EMAIL || password !== SA_PASSWORD) {
      throw new AppError("Invalid credentials", 401);
    }

    const payload = {
      uid: "super-admin-root",
      role: "super-admin",
      email: SA_EMAIL,
      ownerId: "system",
    };

    const accessToken = await createToken(payload);
    const refreshToken = `rt_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}`;

    return { user: payload, accessToken, refreshToken };
  }

  /* ---------------------------
   * GET ADMINS
   * --------------------------*/
  static async getAdmins() {
    return Storage.getAdmins();
  }

  /* ---------------------------
   * CREATE ADMIN
   * --------------------------*/
  static async createAdmin(data: any) {
    let firebaseUid = data.id || `admin-${Date.now()}`;
    const defaultPassword =
      data.password || Math.random().toString(36).slice(-10) + "A1!";
    const passwordToUse = data.password || defaultPassword;

    try {
      const userRecord = await adminAuth.createUser({
        uid: firebaseUid,
        email: data.email,
        password: passwordToUse,
        displayName: data.name,
      });

      firebaseUid = userRecord.uid;
    } catch (error: any) {
      console.warn("Firebase error:", error.message);
    }

    const admins = await Storage.getAdmins();

    const exists = admins.find(
      (a: any) => a.id === firebaseUid || a.email === data.email
    );

    if (exists) {
      throw new AppError("Admin already exists", 409);
    }

    const newAdmin = {
      id: firebaseUid,
      email: data.email,
      name: data.name,
      passwordHash: passwordToUse,
      eventId: data.id || `EVENT-${firebaseUid.slice(0, 6).toUpperCase()}`,
      status: data.status || "active",
      createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    await Storage.saveAdmins(admins);

    if (data.email) {
      await MailService.sendAdminInvitation(
        data.email,
        data.name || "Admin",
        passwordToUse,
        newAdmin.eventId
      );
    }

    let activationLink = null;

    try {
      if (data.email) {
        activationLink = await adminAuth.generatePasswordResetLink(
          data.email
        );
      }
    } catch (error) {
      // Ignore error if link generation fails
    }

    return {
      ...newAdmin,
      defaultPassword: data.password ? undefined : defaultPassword,
      activationLink,
    };
  }

  /* ---------------------------
   * CREATE SUPER ADMIN
   * --------------------------*/
  static async createSuperAdmin(data: any) {
    const defaultPassword =
      data.password || Math.random().toString(36).slice(-10) + "S1!";
    const passwordToUse = data.password || defaultPassword;

    const newSuperAdmin = {
      id:
        data.id ||
        `SA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      email: data.email,
      name: data.name,
      passwordHash: passwordToUse,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const admins = await Storage.getAdmins();
    admins.push(newSuperAdmin);
    await Storage.saveAdmins(admins);

    if (data.email) {
      await MailService.sendAdminInvitation(
        data.email,
        data.name || "Super Admin",
        passwordToUse,
        "PLATFORM-ROOT"
      );
    }

    return {
      ...newSuperAdmin,
      defaultPassword: data.password ? undefined : defaultPassword,
    };
  }

  /* ---------------------------
   * GET ADMIN BY ID
   * --------------------------*/
  static async getAdminById(id: string) {
    const admins = await Storage.getAdmins();
    return admins.find((a: any) => a.id === id) || null;
  }

  /* ---------------------------
   * UPDATE PROFILE
   * --------------------------*/
  static async updateAdminProfile(
    id: string,
    data: { name?: string; email?: string; phone?: string; password?: string }
  ) {
    const admins = await Storage.getAdmins();
    const idx = admins.findIndex((a: any) => a.id === id);

    if (idx === -1) throw new AppError("Admin not found", 404);

    if (data.name !== undefined) admins[idx].name = data.name;
    if (data.email !== undefined) admins[idx].email = data.email;
    if (data.phone !== undefined) admins[idx].phone = data.phone;

    if (data.password) {
      admins[idx].passwordHash = data.password;
    }

    admins[idx].updatedAt = new Date().toISOString();
    await Storage.saveAdmins(admins);

    return admins[idx];
  }
}