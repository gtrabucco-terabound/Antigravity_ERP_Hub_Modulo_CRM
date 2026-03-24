import * as admin from "firebase-admin";

/**
 * Singleton para el Firebase Admin SDK en el módulo CRM.
 * Se utiliza para crear usuarios desde el dashboard o gestionar permisos.
 */

if (!admin.apps.length) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountVar) {
      const serviceAccount = JSON.parse(
        serviceAccountVar.startsWith("{") 
          ? serviceAccountVar 
          : Buffer.from(serviceAccountVar, "base64").toString()
      );
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      const serviceAccount = require("../../../firebase-admin-sdk.json");
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    console.error("Error al inicializar Firebase Admin (CRM):", error);
  }
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
export default admin;
