import { Controller, Get } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get('public')
  getPublic() {
    return this.siteSettingsService.getPublicSettings();
  }
}
