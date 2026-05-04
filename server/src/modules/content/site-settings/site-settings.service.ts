import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly config: ConfigService) {}

  getPublicSettings() {
    const contactEmail = this.config.get<string>('CONTACT_EMAIL') ?? null;
    const contactPhone = this.config.get<string>('CONTACT_PHONE') ?? null;
    const contactAddress = this.config.get<string>('CONTACT_ADDRESS') ?? null;

    const facebookUrl = this.config.get<string>('SOCIAL_FACEBOOK_URL') ?? null;
    const instagramUrl = this.config.get<string>('SOCIAL_INSTAGRAM_URL') ?? null;
    const tiktokUrl = this.config.get<string>('SOCIAL_TIKTOK_URL') ?? null;

    const contractUrl = this.config.get<string>('CONTRACT_URL') ?? null;

    return {
      contact: {
        email: contactEmail,
        phone: contactPhone,
        address: contactAddress,
      },
      socials: {
        facebookUrl,
        instagramUrl,
        tiktokUrl,
      },
      legal: {
        contractUrl,
      },
    };
  }
}
