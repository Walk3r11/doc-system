import { BadRequestException } from "@nestjs/common";
import { Role, VisitStatus } from "@prisma/client";
import { VisitsService } from "./visits.service";

describe("VisitsService", () => {
  const prismaMock = {
    patient: {
      findUnique: jest.fn(),
    },
    visit: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const scheduleResolverMock = {
    isWithinWorkingHours: jest.fn(),
  };

  const service = new VisitsService(
    prismaMock as never,
    scheduleResolverMock as never,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("rejects visit creation when less than 24 hours ahead", async () => {
    const start = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    await expect(
      service.createVisit(
        {
          userId: "u1",
          role: Role.PATIENT,
          patientId: "p1",
        },
        start,
        end,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects overlapping visits for same doctor", async () => {
    const start = new Date(Date.now() + 30 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    prismaMock.patient.findUnique.mockResolvedValue({ id: "p1", doctorId: "d1" });
    scheduleResolverMock.isWithinWorkingHours.mockResolvedValue(true);
    prismaMock.visit.findFirst.mockResolvedValue({ id: "v-existing" });

    await expect(
      service.createVisit(
        { userId: "u1", role: Role.PATIENT, patientId: "p1" },
        start,
        end,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("cancels visit when >12h before start", async () => {
    const visitStart = new Date(Date.now() + 20 * 60 * 60 * 1000);
    prismaMock.visit.findUnique.mockResolvedValue({
      id: "v1",
      doctorId: "d1",
      patientId: "p1",
      status: VisitStatus.SCHEDULED,
      startAt: visitStart,
    });
    prismaMock.visit.update.mockResolvedValue({
      id: "v1",
      status: VisitStatus.CANCELLED,
    });

    const result = await service.cancelVisit(
      { userId: "u1", role: Role.PATIENT, patientId: "p1" },
      "v1",
    );
    expect(result.status).toBe(VisitStatus.CANCELLED);
  });
});
