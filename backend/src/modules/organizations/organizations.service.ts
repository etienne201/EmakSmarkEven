import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  async create(data: any) {
    return this.prisma.organization.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async findUsers(orgId: string) {
    return this.prisma.user.findMany({
      where: { organizationId: orgId },
    });
  }

  async addUser(orgId: string, userData: any) {
    // In a real app, hash password and check roles
    return this.prisma.user.create({
      data: {
        ...userData,
        organizationId: orgId,
      },
    });
  }

  async updateUser(orgId: string, userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId, organizationId: orgId },
      data,
    });
  }

  async removeUser(orgId: string, userId: string) {
    return this.prisma.user.delete({
      where: { id: userId, organizationId: orgId },
    });
  }
}
