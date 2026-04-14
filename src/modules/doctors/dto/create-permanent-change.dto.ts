import { Type } from "class-transformer";
import { IsDateString, ValidateNested } from "class-validator";
import { WeekScheduleDto } from "../../schedules/schedule.dto";

export class CreatePermanentChangeDto {
  @IsDateString()
  effectiveFromDate!: string;

  @ValidateNested()
  @Type(() => WeekScheduleDto)
  schedule!: WeekScheduleDto;
}
