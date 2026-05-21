import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Guests & Attendance')
@Controller('qr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QRController {

  @Post('generate')
  @ApiOperation({ summary: 'Générer manuellement un QR code' })
  async generate(@Body() body: { data: string }) {
    return { qrUrl: '...' };
  }

  @Post('scan')
  @ApiOperation({ summary: 'Enregistrer un scan de QR code' })
  async scan(@Body() body: { code: string }) {
    return { success: true };
  }
}
