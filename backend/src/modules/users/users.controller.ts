import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountCreationGuard } from '../auth/guards/account-creation.guard';
import { TargetRoleField } from '../auth/decorators/target-role-field.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/auth.types';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Super Admin)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(AccountCreationGuard)
  @TargetRoleField('roleId')
  @ApiOperation({ summary: 'Créer un utilisateur' })
  async create(@Body() dto: CreateUserDto, @CurrentUser() creator: AuthUser) {
    return this.usersService.create(dto, creator);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer son propre profil' })
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Put('profile')
  @ApiOperation({ summary: 'Modifier son propre profil' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Put('profile/avatar')
  @ApiOperation({ summary: 'Modifier son avatar' })
  async updateAvatar(@Req() req: any, @Body() body: { avatarUrl: string }) {
    return this.usersService.update(req.user.id, { avatarUrl: body.avatarUrl });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Modifier un utilisateur' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
