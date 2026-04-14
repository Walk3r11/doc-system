import { Type } from "class-transformer";
import { IsDateString, ValidateNested } from "class-validator";
import { WeekScheduleDto } from "../../schedules/schedule.dto";

export class CreateTemporaryChangeDto {
  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;

  @ValidateNested()
  @Type(() => WeekScheduleDto)
  schedule!: WeekScheduleDto;
}
