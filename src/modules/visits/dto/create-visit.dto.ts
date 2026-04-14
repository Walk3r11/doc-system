import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateVisitDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}
