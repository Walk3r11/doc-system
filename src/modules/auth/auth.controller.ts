import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDoctorDto } from "./dto/register-doctor.dto";
import { RegisterPatientDto } from "./dto/register-patient.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/doctor")
  registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.authService.registerDoctor(dto);
  }

  @Post("register/patient")
  registerPatient(@Body() dto: RegisterPatientDto) {
    return this.authService.registerPatient(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
