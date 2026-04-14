import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { WeekSchedule } from "./schedule.dto";
import { parseTimeToMinutes } from "./schedule.utils";

@Injectable()
export class ScheduleResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async isWithinWorkingHours(
    doctorId: string,
    startAt: Date,
    endAt: Date,
  ): Promise<boolean> {
    if (startAt >= endAt) {
      return false;
    }
    if (startAt.toDateString() !== endAt.toDateString()) {
      return false;
    }

    const schedule = await this.getScheduleForDate(doctorId, startAt);
    const day = startAt.getDay();
    const daySchedule = schedule.find((item) => item.dayOfWeek === day);
    if (!daySchedule) {
      return false;
    }

    const startMinutes = startAt.getHours() * 60 + startAt.getMinutes();
    const endMinutes = endAt.getHours() * 60 + endAt.getMinutes();

    return daySchedule.intervals.some((interval) => {
      const intervalStart = parseTimeToMinutes(interval.start);
      const intervalEnd = parseTimeToMinutes(interval.end);
      return startMinutes >= intervalStart && endMinutes <= intervalEnd;
    });
  }

  async getScheduleForDate(doctorId: string, date: Date): Promise<WeekSchedule> {
    const baseSchedule = await this.getBaseSchedule(doctorId);

    const permanentChange = await this.prisma.permanentScheduleChange.findFirst({
      where: {
        doctorId,
        effectiveFromDate: {
          lte: date,
        },
      },
      orderBy: {
        effectiveFromDate: "desc",
      },
    });

    let activeSchedule = baseSchedule;
    if (permanentChange) {
      activeSchedule = permanentChange.newScheduleJson as WeekSchedule;
    }

    const temporaryChange = await this.prisma.temporaryScheduleChange.findFirst({
      where: {
        doctorId,
        active: true,
        startAt: {
          lte: date,
        },
        endAt: {
          gte: date,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (temporaryChange) {
      activeSchedule = temporaryChange.overrideScheduleJson as WeekSchedule;
    }

    return activeSchedule;
  }

  async getBaseSchedule(doctorId: string): Promise<WeekSchedule> {
    const rules = await this.prisma.doctorScheduleRule.findMany({
      where: { doctorId },
      include: {
        intervals: {
          orderBy: {
            startMinutes: "asc",
          },
        },
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    });

    return rules.map((rule) => ({
      dayOfWeek: rule.dayOfWeek,
      intervals: rule.intervals.map((interval) => ({
        start: this.minutesToTime(interval.startMinutes),
        end: this.minutesToTime(interval.endMinutes),
      })),
    }));
  }

  private minutesToTime(value: number): string {
    const hour = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const minute = (value % 60).toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }
}
