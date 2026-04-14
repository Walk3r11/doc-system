import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class TimeIntervalDto {
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  start!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  end!: string;
}

export class DayScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeIntervalDto)
  intervals!: TimeIntervalDto[];
}

export class WeekScheduleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  schedule!: DayScheduleDto[];
}

export type WeekSchedule = Array<{
  dayOfWeek: number;
  intervals: Array<{ start: string; end: string }>;
}>;
