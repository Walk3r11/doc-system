import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { WeekScheduleDto } from "../../schedules/schedule.dto";

export class UpdateScheduleDto {
  @ValidateNested()
  @Type(() => WeekScheduleDto)
  schedule!: WeekScheduleDto;
}
