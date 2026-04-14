import { Module } from "@nestjs/common";
import { ScheduleResolverService } from "../schedules/schedule-resolver.service";
import { VisitsController } from "./visits.controller";
import { VisitsService } from "./visits.service";

@Module({
  controllers: [VisitsController],
  providers: [VisitsService, ScheduleResolverService],
})
export class VisitsModule {}
