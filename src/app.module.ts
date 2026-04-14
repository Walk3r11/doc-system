import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { DoctorsModule } from "./modules/doctors/doctors.module";
import { PatientsModule } from "./modules/patients/patients.module";
import { VisitsModule } from "./modules/visits/visits.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RolesGuard } from "./common/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DoctorsModule,
    PatientsModule,
    VisitsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
