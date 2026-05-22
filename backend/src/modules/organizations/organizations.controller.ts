import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

import { AddOrganizationUserDto, UpdateOrganizationUserDto } from './dto/organization-user.dto';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  
  @Get()
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Lister toutes les organisations (Super Admin)' })
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Post()
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Créer une organisation' })
  async create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une organisation par ID' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une organisation' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Supprimer une organisation' })
  async remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  // ORGANIZATION USERS
  @Get(':id/users')
  @ApiOperation({ summary: 'Lister les utilisateurs d une organisation' })
  async findUsers(@Param('id') id: string) {
    return this.organizationsService.findUsers(id);
  }

  @Post(':id/users')
  @ApiOperation({ summary: 'Ajouter un utilisateur à une organisation' })
  async addUser(@Param('id') id: string, @Body() dto: AddOrganizationUserDto) {
    return this.organizationsService.addUser(id, dto);
  }

  @Put(':id/users/:userId')
  @ApiOperation({ summary: 'Modifier un utilisateur d une organisation' })
  async updateUser(@Param('id') id: string, @Param('userId') userId: string, @Body() dto: UpdateOrganizationUserDto) {
    return this.organizationsService.updateUser(id, userId, dto);
  }

  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Retirer un utilisateur d une organisation' })
  async removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.organizationsService.removeUser(id, userId);
  }
}
