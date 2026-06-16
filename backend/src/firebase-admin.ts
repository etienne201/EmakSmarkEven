import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * FIREBASE ADMIN SDK (Singleton)
 * Configuration pour l'accès privilégié côté serveur.
 */

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "evensamrk";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!getApps().length) {
  try {
    if (clientEmail && privateKey && privateKey.trim() !== "") {
      const formattedKey = privateKey
        .replace(/\\n/g, "\n")
        .replace(/^"(.*)"$/, "$1")
        .trim();

      console.log(`📡 Firebase Init - Project: ${projectId}, Email: ${clientEmail}, KeyLen: ${formattedKey.length}`);
      
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formattedKey,
        }),
      });
      console.log("✅ Firebase Admin SDK : Initialisé avec Compte de Service");
    } else {
      initializeApp({
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

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminStorage = getStorage();
