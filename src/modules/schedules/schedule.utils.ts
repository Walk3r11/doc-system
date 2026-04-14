import { BadRequestException } from "@nestjs/common";
import { WeekSchedule } from "./schedule.dto";

export function parseTimeToMinutes(value: string): number {
  const [hour, minute] = value.split(":").map((part) => Number(part));
  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new BadRequestException(`Invalid time value: ${value}`);
  }
  return hour * 60 + minute;
}

export function validateWeekSchedule(schedule: WeekSchedule) {
  const daySet = new Set<number>();

  for (const daySchedule of schedule) {
    if (daySet.has(daySchedule.dayOfWeek)) {
      throw new BadRequestException("Duplicate dayOfWeek in schedule.");
    }
    daySet.add(daySchedule.dayOfWeek);

    let lastEnd = -1;
    for (const interval of daySchedule.intervals) {
      const start = parseTimeToMinutes(interval.start);
      const end = parseTimeToMinutes(interval.end);
      if (start >= end) {
        throw new BadRequestException("Schedule interval start must be before end.");
      }
      if (start < lastEnd) {
        throw new BadRequestException(
          "Schedule intervals cannot overlap for the same day.",
        );
      }
      lastEnd = end;
    }
  }
}
