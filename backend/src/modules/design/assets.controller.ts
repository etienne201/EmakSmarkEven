import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Design & Content')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetsController {

  @Post('assets/upload')
  @ApiOperation({ summary: 'Uploader un asset (image, PDF)' })
  async upload() {
    return { url: '...' };
  }

  @Get('assets/:id')
  @ApiOperation({ summary: 'Récupérer les métadonnées d un asset' })
  async findOne(@Param('id') id: string) {
    return { id };
  }

  @Delete('assets/:id')
  @ApiOperation({ summary: 'Supprimer un asset' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }

  @Get('events/:id/gallery')
  @ApiOperation({ summary: 'Lister les assets de la galerie d un événement' })
  async getGallery(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/gallery')
  @ApiOperation({ summary: 'Ajouter un asset à la galerie' })
  async addToGallery(@Param('id') id: string) {
    return { success: true };
  }

  @Delete('events/:id/gallery/:assetId')
  @ApiOperation({ summary: 'Retirer un asset de la galerie' })
  async removeFromGallery(@Param('id') id: string, @Param('assetId') assetId: string) {
    return { success: true };
  }
}
