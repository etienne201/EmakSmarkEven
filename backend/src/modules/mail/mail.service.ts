import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendAdminInvitation(
    email: string,
    name: string,
    passwordDefault: string,
    organizationId: string,
  ) {
    const from = process.env.SMTP_FROM || '"Smart Event" <noreply@smartevent.com>';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const mailOptions = {
      from,
      to: email,
      subject: 'Bienvenue sur Smart Event - Vos accès Administrateur',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Bienvenue, ${name} !</h1>
          <p>Votre compte administrateur a été créé avec succès sur la plateforme <strong>EMAKO Smart Event</strong>.</p>

          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Identifiant (Email) :</strong> ${email}</p>
            <p style="margin: 10px 0 0 0;"><strong>Mot de passe par défaut :</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">${passwordDefault}</code></p>
          </div>

          <h2 style="color: #10b981; font-size: 1.1em;">📋 Comment démarrer ?</h2>
          <ol style="padding-left: 20px;">
            <li><strong>Connectez-vous</strong> avec vos identifiants ci-dessus</li>
            <li><strong>Créez votre événement</strong> (titre + type)</li>
            <li><strong>Configurez-le</strong> en 6 étapes rapides (lieu, modules, design…)</li>
            <li><strong>Accédez à votre tableau de bord</strong> pour gérer invités, QR codes et plus</li>
          </ol>

          <p style="color: #6B7280; font-size: 0.9em;">⏱️ La configuration initiale prend environ 3 minutes.</p>

          <div style="margin-top: 30px;">
            <a href="${appUrl}/login"
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
               Se connecter maintenant →
            </a>
          </div>

          <p style="color: #6B7280; font-size: 0.9em; margin-top: 20px;">🔐 Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.</p>

          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 40px 0;">
          <p style="font-size: 0.8em; color: #9CA3AF;">&copy; 2026 EMAKO Smart Event. Tous droits réservés.</p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("⚠️ SMTP non configuré. L'email n'a pas été envoyé réellement.");
        console.log('📧 Email simulé pour :', email);
        console.log('🔑 Mot de passe :', passwordDefault);
        return { success: false, simulated: true };
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé :', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'email :", error);
      return { success: false, error };
    }
  }
}
