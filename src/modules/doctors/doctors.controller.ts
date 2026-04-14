import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { CurrentUser } from "../../common/current-user.decorator";
import { AuthUser } from "../../common/auth-user.interface";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { Roles } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { CreatePermanentChangeDto } from "./dto/create-permanent-change.dto";
import { CreateTemporaryChangeDto } from "./dto/create-temporary-change.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { DoctorsService } from "./doctors.service";

@Controller("doctors/me/schedule")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DOCTOR)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Patch()
  updateBaseSchedule(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.doctorsService.updateBaseSchedule(
      user.doctorId!,
      dto.schedule.schedule,
    );
  }

  @Post("temporary-changes")
  addTemporaryChange(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateTemporaryChangeDto,
  ) {
    return this.doctorsService.addTemporaryScheduleChange(
      user.doctorId!,
      new Date(dto.startAt),
      new Date(dto.endAt),
      dto.schedule.schedule,
    );
  }

  @Post("permanent-changes")
  addPermanentChange(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePermanentChangeDto,
  ) {
    return this.doctorsService.addPermanentScheduleChange(
      user.doctorId!,
      new Date(dto.effectiveFromDate),
      dto.schedule.schedule,
    );
  }
}
