import { IsEmail, IsString, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { WeekScheduleDto } from "../../schedules/schedule.dto";

export class RegisterDoctorDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  address!: string;

  @ValidateNested()
  @Type(() => WeekScheduleDto)
  workingSchedule!: WeekScheduleDto;
}
