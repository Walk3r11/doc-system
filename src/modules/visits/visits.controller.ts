import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { AuthUser } from "../../common/auth-user.interface";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { CreateVisitDto } from "./dto/create-visit.dto";
import { VisitsService } from "./visits.service";

@Controller("visits")
@UseGuards(JwtAuthGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  createVisit(@CurrentUser() user: AuthUser, @Body() dto: CreateVisitDto) {
    return this.visitsService.createVisit(
      user,
      new Date(dto.startAt),
      new Date(dto.endAt),
      dto.patientId,
    );
  }

  @Post(":id/cancel")
  cancelVisit(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.visitsService.cancelVisit(user, id);
  }

  @Get("me")
  listMyVisits(@CurrentUser() user: AuthUser) {
    return this.visitsService.listMyVisits(user);
  }
}
