import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { WeekSchedule } from "../schedules/schedule.dto";
import {
  parseTimeToMinutes,
  validateWeekSchedule,
} from "../schedules/schedule.utils";

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async updateBaseSchedule(doctorId: string, schedule: WeekSchedule) {
    validateWeekSchedule(schedule);

    await this.prisma.$transaction(async (tx) => {
      const doctor = await tx.doctor.findUnique({
        where: { id: doctorId },
        select: { id: true },
      });
      if (!doctor) {
        throw new NotFoundException("Doctor not found.");
      }

      await tx.doctorScheduleRule.deleteMany({
        where: { doctorId },
      });

      for (const day of schedule) {
        await tx.doctorScheduleRule.create({
          data: {
            doctorId,
            dayOfWeek: day.dayOfWeek,
            intervals: {
              create: day.intervals.map((interval) => ({
                startMinutes: parseTimeToMinutes(interval.start),
                endMinutes: parseTimeToMinutes(interval.end),
              })),
            },
          },
        });
      }
    });

    return { success: true };
  }

  async addTemporaryScheduleChange(
    doctorId: string,
    startAt: Date,
    endAt: Date,
    schedule: WeekSchedule,
  ) {
    validateWeekSchedule(schedule);
    if (startAt >= endAt) {
      throw new BadRequestException("Temporary change startAt must be before endAt.");
    }

    const overlap = await this.prisma.temporaryScheduleChange.findFirst({
      where: {
        doctorId,
        active: true,
        startAt: {
          lt: endAt,
        },
        endAt: {
          gt: startAt,
        },
      },
      select: { id: true },
    });

    if (overlap) {
      throw new BadRequestException(
        "Overlapping temporary schedule change already exists.",
      );
    }

    const record = await this.prisma.temporaryScheduleChange.create({
      data: {
        doctorId,
        startAt,
        endAt,
        overrideScheduleJson: schedule,
        active: true,
      },
    });

    return record;
  }

  async addPermanentScheduleChange(
    doctorId: string,
    effectiveFromDate: Date,
    schedule: WeekSchedule,
  ) {
    validateWeekSchedule(schedule);
    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (effectiveFromDate < oneWeekFromNow) {
      throw new BadRequestException(
        "Permanent schedule changes must be at least one week in the future.",
      );
    }

    return this.prisma.permanentScheduleChange.create({
      data: {
        doctorId,
        effectiveFromDate,
        newScheduleJson: schedule,
      },
    });
  }
}
