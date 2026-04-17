import { Controller, Get } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Site Settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get('public')
  getPublic() {
    return this.siteSettingsService.getPublicSettings();
  }
}
