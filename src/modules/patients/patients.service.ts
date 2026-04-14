import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  findById(patientId: string) {
    return this.prisma.patient.findUnique({
      where: { id: patientId },
    });
  }
}
