import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDoctorDto } from "./dto/register-doctor.dto";
import { RegisterPatientDto } from "./dto/register-patient.dto";
import { LoginDto } from "./dto/login.dto";
import {
  parseTimeToMinutes,
  validateWeekSchedule,
} from "../schedules/schedule.utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerDoctor(dto: RegisterDoctorDto) {
    await this.ensureEmailIsUnique(dto.email);
    validateWeekSchedule(dto.workingSchedule.schedule);

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const doctor = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: Role.DOCTOR,
        doctor: {
          create: {
            name: dto.name,
            email: dto.email,
            address: dto.address,
            scheduleRules: {
              create: dto.workingSchedule.schedule.map((day) => ({
                dayOfWeek: day.dayOfWeek,
                intervals: {
                  create: day.intervals.map((interval) => ({
                    startMinutes: parseTimeToMinutes(interval.start),
                    endMinutes: parseTimeToMinutes(interval.end),
                  })),
                },
              })),
            },
          },
        },
      },
      include: {
        doctor: true,
      },
    });

    return {
      id: doctor.doctor?.id,
      userId: doctor.id,
      email: doctor.email,
    };
  }

  async registerPatient(dto: RegisterPatientDto) {
    await this.ensureEmailIsUnique(dto.email);

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor) {
      throw new NotFoundException("Doctor not found.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const patient = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: Role.PATIENT,
        patient: {
          create: {
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            doctorId: dto.doctorId,
          },
        },
      },
      include: {
        patient: true,
      },
    });

    return {
      id: patient.patient?.id,
      userId: patient.id,
      email: patient.email,
      doctorId: patient.patient?.doctorId,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const validPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        role: user.role,
        doctorId: user.doctor?.id,
        patientId: user.patient?.id,
      },
    };
  }

  private async ensureEmailIsUnique(email: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      throw new BadRequestException("Email is already in use.");
    }
  }
}
