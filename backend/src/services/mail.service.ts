import { MailService as NestMailService } from "../modules/mail/mail.service";

/**
 * Service pour l'envoi d'emails (Invitation Admin, Welcome, etc.)
 */
export class MailService {
  private static readonly instance = new NestMailService();

  static async sendAdminInvitation(
    email: string,
    name: string,
    passwordDefault: string,
    eventId: string,
  ) {
    return this.instance.sendAdminInvitation(email, name, passwordDefault, eventId);
  }
}
