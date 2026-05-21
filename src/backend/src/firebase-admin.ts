import * as admin from "firebase-admin";

/**
 * FIREBASE ADMIN SDK (Singleton)
 * Configuration pour l'accès privilégié côté serveur.
 */

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "evensamrk";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  try {
    if (clientEmail && privateKey && privateKey.trim() !== "") {
      // Clean the private key: replace escaped newlines and remove extra quotes if any
      const formattedKey = privateKey
        .replace(/\\n/g, "\n")
        .replace(/^"(.*)"$/, "$1")
        .trim();

      console.log(`📡 Firebase Init - Project: ${projectId}, Email: ${clientEmail}, KeyLen: ${formattedKey.length}`);
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
      console.log("✅ Firebase Admin SDK : Initialisé avec Compte de Service");
    } else {
      // Initialize with just projectId for limited local functionality (e.g. metadata)
      // This avoids the heavy "EADDRINUSE" or "Missing Credentials" warnings in some environments
      admin.initializeApp({
        projectId,
      });
      
      if (process.env.NODE_ENV === "production") {
        console.warn("⚠️ Firebase Admin : Initialisé sans clé privée (Fonctionnalités Auth Firebase désactivées)");
      } else {
        console.log("ℹ️ Firebase Admin : Mode local (PostgreSQL activé, Firebase Auth en attente de configuration)");
      }
    }
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export default admin;
