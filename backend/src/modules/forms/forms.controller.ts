import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Engagement')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FormsController {

  @Get('events/:id/forms')
  @ApiOperation({ summary: 'Lister les formulaires d un événement' })
  async findAll(@Param('id') id: string) {
    return [];
  }

  @Post('events/:id/forms')
  @ApiOperation({ summary: 'Créer un formulaire dynamique' })
  async create(@Param('id') id: string, @Body() dto: any) {
    return { success: true };
  }

  @Put('forms/:id')
  @ApiOperation({ summary: 'Modifier un formulaire' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return { success: true };
  }

  @Delete('forms/:id')
  @ApiOperation({ summary: 'Supprimer un formulaire' })
  async remove(@Param('id') id: string) {
    return { success: true };
  }

  @Post('forms/:id/respond')
  @ApiOperation({ summary: 'Répondre à un formulaire' })
  async respond(@Param('id') id: string, @Body() answers: any) {
    return { success: true };
  }

  @Get('forms/:id/responses')
  @ApiOperation({ summary: 'Lister les réponses d un formulaire' })
  async getResponses(@Param('id') id: string) {
    return [];
  }
}
