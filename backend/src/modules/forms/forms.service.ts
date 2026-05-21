import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async createForm(eventId: string, data: any) {
    return this.prisma.dynamicForm.create({
      data: { ...data, eventId },
    });
  }

  async getForms(eventId: string) {
    return this.prisma.dynamicForm.findMany({
      where: { eventId },
    });
  }

  async getFormById(id: string) {
    return this.prisma.dynamicForm.findUnique({
      where: { id },
    });
  }

  async updateForm(id: string, data: any) {
    return this.prisma.dynamicForm.update({
      where: { id },
      data,
    });
  }

  async deleteForm(id: string) {
    return this.prisma.dynamicForm.delete({
      where: { id },
    });
  }

  async getSubmissions(formId: string) {
    return this.prisma.formResponse.findMany({
      where: { formId },
    });
  }

  async createSubmission(formId: string, data: any) {
    return this.prisma.formResponse.create({
      data: { ...data, formId },
    });
  }
}
