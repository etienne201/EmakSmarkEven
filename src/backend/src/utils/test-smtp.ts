import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  console.log("🔍 Vérification de la configuration SMTP...");
  console.log(`Host: ${process.env.SMTP_HOST || "smtp.gmail.com"}`);
  console.log(`Port: ${process.env.SMTP_PORT || "587"}`);
  console.log(`User: ${process.env.SMTP_USER}`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Connexion SMTP réussie ! Nodemailer est prêt à envoyer des emails.");
  } catch (error) {
    console.error("❌ Échec de la connexion SMTP :");
    console.error(error);
    console.log("\n💡 Astuces :");
    console.log("- Vérifiez que votre mot de passe d'application Gmail est correct.");
    console.log("- Vérifiez que le port (587 ou 465) correspond à votre configuration.");
    console.log("- Assurez-vous que l'accès aux 'applications moins sécurisées' ou 2FA est géré.");
  }
}

testConnection();
