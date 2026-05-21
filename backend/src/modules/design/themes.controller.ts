import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DesignService } from './design.service';
import { UpdateThemeDto } from './dto/update-theme.dto';

@ApiTags('Design & Content')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ThemesController {
  constructor(private readonly designService: DesignService) {}

  @Get('events/:id/themes')
  @ApiOperation({ summary: 'Lister les thèmes d un événement' })
  async findAll(@Param('id') id: string) {
    return this.designService.findEventThemes(id);
  }

  @Post('events/:id/themes')
  @ApiOperation({ summary: 'Créer un thème pour l événement' })
  async create(@Param('id') id: string, @Body() dto: UpdateThemeDto) {
    return this.designService.createEventTheme(id, dto);
  }

  @Get('themes/:id')
  @ApiOperation({ summary: 'Récupérer un thème' })
  async findOne(@Param('id') id: string) {
    return this.designService.findOneTheme(id);
  }

  @Put('themes/:id')
  @ApiOperation({ summary: 'Modifier un thème' })
  async update(@Param('id') id: string, @Body() dto: UpdateThemeDto) {
    return this.designService.updateEventTheme(id, dto);
  }

  @Delete('themes/:id')
  @ApiOperation({ summary: 'Supprimer un thème' })
  async remove(@Param('id') id: string) {
    return this.designService.deleteEventTheme(id);
  }
}
