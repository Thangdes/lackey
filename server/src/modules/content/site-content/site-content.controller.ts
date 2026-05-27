import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    HttpCode,
    HttpStatus,
    applyDecorators,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
  } from '@nestjs/common';
  import { SiteContentService } from './site-content.service';
  import { CreateSiteContentDto } from './dto/create-site-content.dto';
  import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
  import { AdminGuard } from '@/modules/auth/admin.gaurd';
  import { ContentType } from '@prisma/client';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';
 
  const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));
 
  @ApiTags('Site Content')
  @ApiBearerAuth()
  @Controller('site-content')
  export class SiteContentController {
    constructor(private readonly siteContentService: SiteContentService) {}
 
    @Get('/banners')
    findBanners() {
      return this.siteContentService.findPublishedBanners();
    }
 
    @Get('/testimonials')
    findTestimonials() {
      return this.siteContentService.findPublishedTestimonials();
    }
 
    @Get('/gallery')
    findGallery() {
      return this.siteContentService.findPublishedGallery();
    }
  
    @Post()
    @AdminAccess()
    create(@Body() createSiteContentDto: CreateSiteContentDto) {
      return this.siteContentService.create(createSiteContentDto);
    }
  
    @Get('/admin/all')
    @AdminAccess()
    findAllAdmin(@Query('type') type?: ContentType) {
      return this.siteContentService.findAllAdmin(type);
    }
  
    @Get('/admin/:id')
    @AdminAccess()
    findOne(@Param('id', ParseObjectIdPipe) id: string) {
      return this.siteContentService.findOne(id);
    }
  
    @Patch('/admin/:id')
    @AdminAccess()
    update(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body() updateSiteContentDto: UpdateSiteContentDto,
    ) {
      return this.siteContentService.update(id, updateSiteContentDto);
    }
 
    @Post('/admin/:id/thumbnail')
    @AdminAccess()
    @UseInterceptors(FileInterceptor('thumbnail'))
    @HttpCode(HttpStatus.OK)
    updateThumbnail(
      @Param('id', ParseObjectIdPipe) id: string,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
            new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
          ],
          fileIsRequired: true,
        }),
      )
      thumbnailFile: Express.Multer.File,
    ) {
      return this.siteContentService.updateThumbnail(id, thumbnailFile);
    }
 
    @Delete('/admin/:id')
    @AdminAccess()
    remove(@Param('id', ParseObjectIdPipe) id: string) {
      return this.siteContentService.remove(id);
    }
  }