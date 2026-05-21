import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
  }

  async create(data: any) {
    return this.prisma.role.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany();
  }
}
