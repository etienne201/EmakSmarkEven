import * as nodemailer from "nodemailer";

/**
 * Service pour l'envoi d'emails (Invitation Admin, Welcome, etc.)
 */
export class MailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  /**
   * Envoie un email d'invitation avec le mot de passe par défaut.
   */
  static async sendAdminInvitation(email: string, name: string, passwordDefault: string, eventId: string) {
    const from = process.env.SMTP_FROM || '"Smart Event" <noreply@smartevent.com>';
    
    const mailOptions = {
      from,
      to: email,
      subject: "Bienvenue sur Smart Event - Vos accès Administrateur",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #4F46E5;">Bienvenue, ${name} !</h1>
          <p>Votre compte administrateur a été créé avec succès sur la plateforme Smart Event.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Identifiant (Email) :</strong> ${email}</p>
            <p style="margin: 10px 0 0 0;"><strong>Mot de passe par défaut :</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${passwordDefault}</code></p>
            <p style="margin: 10px 0 0 0;"><strong>ID Événement :</strong> ${eventId}</p>
          </div>

          <p>Vous pouvez vous connecter à votre tableau de bord dès maintenant pour gérer vos invités et la configuration de votre événement.</p>
          
          <p style="color: #6B7280; font-size: 0.9em;">Note : Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
          
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Se connecter au Dashboard
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 40px 0;">
          <p style="font-size: 0.8em; color: #9CA3AF;">&copy; 2026 Smart Event AI OS. Tous droits réservés.</p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("⚠️ SMTP non configuré. L'email n'a pas été envoyé réellement.");
        console.log("📧 Email simulé pour :", email);
        console.log("🔑 Mot de passe :", passwordDefault);
        return { success: false, simulated: true };
      }
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email envoyé :", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'email :", error);
      return { success: false, error };
    }
  }
}
