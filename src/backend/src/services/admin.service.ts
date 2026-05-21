import { prisma } from "../prisma";
import { AppError } from "@backend/middleware/error-handler";
import { createToken } from "../auth";
import { adminAuth } from "../firebase-admin";
import { MailService } from "./mail.service";


export class AdminService {
  /**
   * Synchronise un utilisateur Firebase avec la base PostgreSQL.
   * Appelé lors de la première connexion ou du rafraîchissement du profil.
   */
  static async syncFirebaseUser(uid: string, email?: string, name?: string) {
    const existingAdmin = await prisma.admins.findUnique({ where: { id: uid } });
    
    if (!existingAdmin) {
      throw new AppError("Accès refusé. Votre compte n'a pas été autorisé par un Super Administrateur.", 403);
    }

    return prisma.admins.update({
      where: { id: uid },
      data: { 
        email: email || existingAdmin.email,
        name: name || existingAdmin.name,
        lastLoginAt: new Date()
      }
    });
  }

  static async adminLogin(eventIdOrEmail: string, password: string) {
    const admin = await prisma.admins.findFirst({
      where: {
        OR: [
          { eventId: eventIdOrEmail },
          { email: eventIdOrEmail }
        ]
      }
    });

    if (!admin || admin.passwordHash !== password) {
      // Vérifier si c'est un Super Admin qui tente de se connecter via l'ID Événement
      const SA_EMAIL = process.env.SUPERADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || "superadmin@smartevent.com";
      const SA_PASSWORD = process.env.SUPERADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || "Superadmin123@";
      
      if (eventIdOrEmail === SA_EMAIL && password === SA_PASSWORD) {
        const payload = {
          uid: "super-admin-root",
          role: "super-admin",
          email: SA_EMAIL,
          ownerId: "system"
        };
        const token = await createToken(payload);
        return { user: payload, token };
      }

      // Fallback for local development demo user if not found in DB
      if (eventIdOrEmail === "UserEven" && password === "User123@") {
        const payload = {
          uid: "user-even-id",
          ownerId: "UserEven",
          role: "admin",
          email: "usereven@smartevent.com"
        };
        const token = await createToken(payload);
        return { user: payload, token };
      }

      throw new AppError("Invalid event ID or password", 401);
    }

    const payload = {
      uid: admin.id,
      ownerId: admin.id,
      role: "admin",
      email: admin.email,
      name: admin.name
    };

    const token = await createToken(payload);

    // Mettre à jour la date de dernière connexion
    await prisma.admins.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    }).catch(err => console.error("Failed to update admin lastLoginAt:", err));

    return { user: payload, token };
  }

  static async superAdminLogin(email: string, password: string, totp?: string) {
    // Note: Pour le SuperAdmin, on pourrait aussi utiliser Firebase avec un Custom Claim
    const SA_EMAIL = process.env.SUPERADMIN_EMAIL || process.env.SUPER_ADMIN_EMAIL || "superadmin@smartevent.com";
    const SA_PASSWORD = process.env.SUPERADMIN_PASSWORD || process.env.SUPER_ADMIN_PASSWORD || "Superadmin123@";

    if (email !== SA_EMAIL || password !== SA_PASSWORD) {
      throw new AppError("Invalid credentials", 401);
    }
    
    const payload = {
      uid: "super-admin-root",
      role: "super-admin",
      email: SA_EMAIL,
      ownerId: "system"
    };

    const token = await createToken(payload);

    // Mettre à jour la date de dernière connexion pour le Super Admin
    await prisma.superAdmin.update({
      where: { id: payload.uid },
      data: { lastLoginAt: new Date() }
    }).catch(err => console.error("Failed to update superAdmin lastLoginAt:", err));

    return { user: payload, token };
  }


  static async getAdmins() {
    return prisma.admins.findMany({
      include: {
        event: true
      }
    });
  }

  static async createAdmin(data: any) {
    let firebaseUid = data.id;
    // Génération d'un mot de passe par défaut si non fourni
    const defaultPassword = data.password || Math.random().toString(36).slice(-10) + "A1!";
    const passwordToUse = data.password || defaultPassword;

    // 1. Tenter la création dans Firebase Auth si les credentials sont présents
    try {
      const userRecord = await adminAuth.createUser({
        uid: data.id,
        email: data.email,
        password: passwordToUse,
        displayName: data.name,
      });
      firebaseUid = userRecord.uid;
      console.log(`✅ Utilisateur Firebase créé : ${firebaseUid}`);
    } catch (error: any) {
      console.warn("⚠️ Firebase Auth bypassé ou erreur:", error.message);
    }

    // 2. Vérifier si l'admin existe déjà dans PostgreSQL
    const existingAdmin = await prisma.admins.findFirst({
      where: {
        OR: [
          { id: firebaseUid },
          ...(data.email ? [{ email: data.email }] : [])
        ]
      }
    });

    if (existingAdmin) {
      throw new AppError(
        `Un administrateur avec cet identifiant ou cet email existe déjà (ID: ${existingAdmin.id})`,
        409
      );
    }

    // 3. Création dans PostgreSQL (Source de vérité pour l'application)
    const newAdmin = await prisma.admins.create({
      data: {
        id: firebaseUid,
        email: data.email,
        name: data.name,
        passwordHash: passwordToUse,
        eventId: data.id || `EVENT-${firebaseUid.substring(0, 6).toUpperCase()}`,
        status: data.status || "active"
      }
    });

    // 3. Envoi de l'email d'invitation avec le mot de passe
    if (data.email) {
      await MailService.sendAdminInvitation(
        data.email, 
        data.name || "Administrateur", 
        passwordToUse,
        newAdmin.eventId
      );
    }

    // 4. Génération d'un lien d'activation (Optionnel si on a déjà envoyé le pass)
    let activationLink = null;
    try {
      if (data.email) {
        activationLink = await adminAuth.generatePasswordResetLink(data.email);
      }
    } catch (e) {
      // Silencieux
    }

    return {
      ...newAdmin,
      defaultPassword: data.password ? undefined : defaultPassword, // On retourne le pass généré si besoin
      activationLink
    };
  }


  static async createSuperAdmin(data: any) {
    // Génération d'un mot de passe par défaut si non fourni
    const defaultPassword = data.password || Math.random().toString(36).slice(-10) + "S1!";
    const passwordToUse = data.password || defaultPassword;

    // Création dans PostgreSQL
    const newSuperAdmin = await prisma.superAdmin.create({
      data: {
        id: data.id || `SA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        email: data.email,
        name: data.name,
        passwordHash: passwordToUse, // À hasher en prod
        isActive: true
      }
    });

    // Envoi de l'email d'invitation
    if (data.email) {
      await MailService.sendAdminInvitation(
        data.email, 
        data.name || "Super Administrateur", 
        passwordToUse,
        "PLATFORM-ROOT"
      );
    }

    return {
      ...newSuperAdmin,
      defaultPassword: data.password ? undefined : defaultPassword
    };
  }

  static async getAdminById(id: string) {
    return prisma.admins.findUnique({
      where: { id },
      include: { event: true }
    });
  }

  static async updateAdminProfile(id: string, data: { name?: string; email?: string; phone?: string; password?: string }) {
    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
    };

    if (data.password && data.password.length > 0) {
      updateData.passwordHash = data.password; // Using plain text to match adminLogin implementation
    }

    // Filter out undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    return prisma.admins.update({
      where: { id },
      data: updateData
    });
  }
}

