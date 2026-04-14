import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterPatientDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  phone!: string;

  @IsString()
  doctorId!: string;
}
