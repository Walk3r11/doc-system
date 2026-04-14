import { ScheduleResolverService } from "./schedule-resolver.service";

describe("ScheduleResolverService", () => {
  const prismaMock = {
    doctorScheduleRule: {
      findMany: jest.fn(),
    },
    permanentScheduleChange: {
      findFirst: jest.fn(),
    },
    temporaryScheduleChange: {
      findFirst: jest.fn(),
    },
  };

  const service = new ScheduleResolverService(prismaMock as never);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns true when interval is inside working hours", async () => {
    prismaMock.doctorScheduleRule.findMany.mockResolvedValue([
      {
        dayOfWeek: 1,
        intervals: [{ startMinutes: 510, endMinutes: 1110 }],
      },
    ]);
    prismaMock.permanentScheduleChange.findFirst.mockResolvedValue(null);
    prismaMock.temporaryScheduleChange.findFirst.mockResolvedValue(null);

    const start = new Date("2026-05-11T08:45:00.000Z");
    const end = new Date("2026-05-11T09:15:00.000Z");
    await expect(service.isWithinWorkingHours("doctor-1", start, end)).resolves.toBe(
      true,
    );
  });

  it("returns false when interval is outside working hours", async () => {
    prismaMock.doctorScheduleRule.findMany.mockResolvedValue([
      {
        dayOfWeek: 1,
        intervals: [{ startMinutes: 510, endMinutes: 720 }],
      },
    ]);
    prismaMock.permanentScheduleChange.findFirst.mockResolvedValue(null);
    prismaMock.temporaryScheduleChange.findFirst.mockResolvedValue(null);

    const start = new Date("2026-05-11T12:30:00.000Z");
    const end = new Date("2026-05-11T13:00:00.000Z");
    await expect(service.isWithinWorkingHours("doctor-1", start, end)).resolves.toBe(
      false,
    );
  });
});
