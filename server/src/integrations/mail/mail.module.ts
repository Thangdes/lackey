import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

const templateDir = path.resolve(process.cwd(), 'src', 'mail', 'templates');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM || '"Lackey" <no-reply@lackey.vn>',
      },
      template: {
        dir: templateDir,
        adapter: new HandlebarsAdapter(
          {
            formatCurrency: (value) => {
              if (value === null || value === undefined) return '0';
              return Number(value).toLocaleString('vi-VN');
            },
            formatDate: (date) => {
              if (!date) return '';
              return new Date(date).toLocaleDateString('vi-VN');
            },
            multiply: (a, b) => {
              return Number(a) * Number(b);
            },
          },
          {
            inlineCssEnabled: true,
            inlineCssOptions: {},
          },
        ),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
