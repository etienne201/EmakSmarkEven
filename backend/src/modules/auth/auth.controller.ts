import { Controller, Post, Body, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth & Sessions')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Succès' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Déconnexion' })
  async logout(@Req() req) {
    return { message: 'Logged out' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir le token' })
  async refresh(@Body() body: { refreshToken: string }) {
    return { token: 'new-token' };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return { message: 'Email sent' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialisation du mot de passe avec token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return { message: 'Password updated' };
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Vérification de l email' })
  async verifyEmail(@Body() body: { token: string }) {
    return { message: 'Email verified' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/enable')
  @ApiOperation({ summary: 'Activer la 2FA' })
  async enable2FA() {
    return { qrCode: '...' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/verify')
  @ApiOperation({ summary: 'Vérifier le code 2FA' })
  async verify2FA(@Body() body: { code: string }) {
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Récupérer les infos du compte actuel' })
  async getMe(@Req() req) {
    return req.user;
  }

  // SESSIONS
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('sessions')
  @ApiOperation({ summary: 'Lister les sessions actives' })
  async getSessions(@Req() req) {
    return this.authService.getUserSessions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Supprimer une session spécifique' })
  async deleteSession(@Param('id') id: string) {
    return this.authService.deleteSession(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('sessions/revoke-all')
  @ApiOperation({ summary: 'Révoquer toutes les sessions' })
  async revokeAllSessions(@Req() req: any) {
    return this.authService.revokeAllSessions(req.user.id);
  }
}
