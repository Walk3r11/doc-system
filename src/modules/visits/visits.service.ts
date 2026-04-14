import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CancelledBy, Role, VisitStatus } from "@prisma/client";
import { AuthUser } from "../../common/auth-user.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { ScheduleResolverService } from "../schedules/schedule-resolver.service";

@Injectable()
export class VisitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduleResolver: ScheduleResolverService,
  ) {}

  async createVisit(actor: AuthUser, startAt: Date, endAt: Date, patientId?: string) {
    if (startAt >= endAt) {
      throw new BadRequestException("Visit startAt must be before endAt.");
    }

    const now = new Date();
    const hoursBeforeStart = (startAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursBeforeStart < 24) {
      throw new BadRequestException(
        "Visit must be created at least 24 hours before start time.",
      );
    }

    const resolvedPatientId =
      actor.role === Role.PATIENT ? actor.patientId : patientId;
    if (!resolvedPatientId) {
      throw new BadRequestException("patientId is required for doctor-created visits.");
    }

    const patient = await this.prisma.patient.findUnique({
      where: { id: resolvedPatientId },
      select: {
        id: true,
        doctorId: true,
      },
    });
    if (!patient) {
      throw new NotFoundException("Patient not found.");
    }

    if (actor.role === Role.DOCTOR && actor.doctorId !== patient.doctorId) {
      throw new ForbiddenException("Doctor is not the personal doctor of the patient.");
    }

    const doctorId = patient.doctorId;

    const isWithinWorkingHours = await this.scheduleResolver.isWithinWorkingHours(
      doctorId,
      startAt,
      endAt,
    );
    if (!isWithinWorkingHours) {
      throw new BadRequestException("Visit is outside doctor working hours.");
    }

    const overlappingVisit = await this.prisma.visit.findFirst({
      where: {
        doctorId,
        status: VisitStatus.SCHEDULED,
        startAt: {
          lt: endAt,
        },
        endAt: {
          gt: startAt,
        },
      },
      select: { id: true },
    });
    if (overlappingVisit) {
      throw new BadRequestException(
        "Visit overlaps with another scheduled visit for this doctor.",
      );
    }

    return this.prisma.visit.create({
      data: {
        doctorId,
        patientId: resolvedPatientId,
        startAt,
        endAt,
        status: VisitStatus.SCHEDULED,
      },
    });
  }

  async cancelVisit(actor: AuthUser, visitId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: visitId },
    });
    if (!visit) {
      throw new NotFoundException("Visit not found.");
    }
    if (visit.status === VisitStatus.CANCELLED) {
      throw new BadRequestException("Visit is already cancelled.");
    }

    const canCancelAsDoctor =
      actor.role === Role.DOCTOR && actor.doctorId === visit.doctorId;
    const canCancelAsPatient =
      actor.role === Role.PATIENT && actor.patientId === visit.patientId;
    if (!canCancelAsDoctor && !canCancelAsPatient) {
      throw new ForbiddenException("You are not allowed to cancel this visit.");
    }

    const now = new Date();
    const hoursBeforeStart = (visit.startAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursBeforeStart < 12) {
      throw new BadRequestException(
        "Visit cannot be cancelled later than 12 hours before start time.",
      );
    }

    return this.prisma.visit.update({
      where: { id: visitId },
      data: {
        status: VisitStatus.CANCELLED,
        cancelledAt: now,
        cancelledBy:
          actor.role === Role.DOCTOR ? CancelledBy.DOCTOR : CancelledBy.PATIENT,
      },
    });
  }

  async listMyVisits(actor: AuthUser) {
    if (actor.role === Role.DOCTOR) {
      return this.prisma.visit.findMany({
        where: {
          doctorId: actor.doctorId,
        },
        orderBy: {
          startAt: "asc",
        },
      });
    }

    return this.prisma.visit.findMany({
      where: {
        patientId: actor.patientId,
      },
      orderBy: {
        startAt: "asc",
      },
    });
  }
}
