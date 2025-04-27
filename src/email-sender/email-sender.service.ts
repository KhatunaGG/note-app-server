import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
    constructor(private emailService: MailerService){}

    async sendValidationEmail(
        email: string,
        validationLink: string,
      ) {
        const html = `
        <h1>Welcome to our platform!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${validationLink}">Verify Email</a></p>
        <p>This link will expire in 3 minutes.</p>
        <p>If you did not register for an account, please ignore this email.</p>
      `;
        try {
          const options = {
            from: 'Note-app <khatunaggg12345@gmail.com>',
            to: email,
            html,
          };
    
          await this.emailService.sendMail(options);
          return true;
        } catch (e) {
          console.log('Error sending validation email:', e);
          throw new Error('Failed to send verification email');
        }
      }
}
