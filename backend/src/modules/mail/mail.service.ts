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
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); border: 1px solid #f1f5f9;">
            
            <!-- Logo section -->
            <div style="text-align: center; margin-bottom: 40px;">
              <img src="cid:logo" alt="EMAKO Smart Event" style="max-height: 55px; width: auto; display: block; margin: 0 auto;" />
            </div>

            <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 24px;">
              Bienvenue dans l'aventure, ${name} !
            </h1>

            <p style="font-size: 15px; color: #475569; text-align: center; margin-bottom: 30px;">
              Votre compte administrateur a été créé avec succès sur la plateforme <strong>EMAKO Smart Event</strong>. Vous pouvez dès à présent créer et piloter vos événements.
            </p>

            <!-- Credentials Box -->
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">
                <strong>Identifiant de connexion :</strong> <br />
                <span style="font-size: 15px; color: #0f172a; font-family: monospace; font-weight: bold;">${email}</span>
              </p>
              <p style="margin: 0; font-size: 14px; color: #475569;">
                <strong>Mot de passe par défaut :</strong> <br />
                <span style="font-size: 15px; color: #10b981; font-family: monospace; font-weight: bold; background-color: #ecfdf5; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0; display: inline-block; margin-top: 4px;">${passwordDefault}</span>
              </p>
            </div>

            <!-- Steps Section -->
            <h2 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-bottom: 16px;">🚀 Comment démarrer en 3 minutes ?</h2>
            <table style="width: 100%; font-size: 14px; color: #475569; margin-bottom: 35px; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: top; padding: 0 12px 12px 0; width: 24px;">
                  <span style="background-color: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-weight: bold; font-size: 12px;">1</span>
                </td>
                <td style="vertical-align: top; padding: 0 0 12px 0; line-height: 1.5;">
                  Cliquez sur le bouton de connexion ci-dessous.
                </td>
              </tr>
              <tr>
                <td style="vertical-align: top; padding: 0 12px 12px 0; width: 24px;">
                  <span style="background-color: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-weight: bold; font-size: 12px;">2</span>
                </td>
                <td style="vertical-align: top; padding: 0 0 12px 0; line-height: 1.5;">
                  Connectez-vous avec vos identifiants temporaires.
                </td>
              </tr>
              <tr>
                <td style="vertical-align: top; padding: 0 12px 12px 0; width: 24px;">
                  <span style="background-color: #3b82f6; color: white; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-weight: bold; font-size: 12px;">3</span>
                </td>
                <td style="vertical-align: top; padding: 0 0 12px 0; line-height: 1.5;">
                  Suivez l'assistant rapide pour configurer votre premier événement.
                </td>
              </tr>
            </table>

            <!-- Call to Action Button -->
            <div style="text-align: center; margin-bottom: 35px;">
              <a href="${appUrl}/login"
                 style="background-color: #3b82f6; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 14px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);">
                 Se connecter maintenant →
              </a>
            </div>

            <!-- Warning Footer -->
            <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
              🔐 Pour des raisons de sécurité, nous vous recommandons vivement de modifier ce mot de passe temporaire lors de votre première connexion.
            </p>
            
          </div>

          <!-- Email Footer -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 4px 0;">
              Vous recevez cet e-mail car votre compte a été créé par un administrateur système.
            </p>
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              &copy; 2026 EMAKO Smart Event. Tous droits réservés.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: '/Users/test/Documents/QRcodeTempletMariage/apps/super-admin/public/images/bleulogo.png',
          cid: 'logo',
        },
      ],
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
