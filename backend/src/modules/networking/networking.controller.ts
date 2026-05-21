import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Engagement')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NetworkingController {

  @Get('events/:id/networking')
  @ApiOperation({ summary: 'Lister les participants au networking' })
  async findParticipants(@Param('id') id: string) {
    return [];
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Démarrer une conversation' })
  async createConversation(@Body() body: { participantIds: string[] }) {
    return { id: 'conv-1' };
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Récupérer une conversation' })
  async findConversation(@Param('id') id: string) {
    return { id };
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Envoyer un message' })
  async sendMessage(@Param('id') id: string, @Body() body: { content: string }) {
    return { success: true };
  }
}
