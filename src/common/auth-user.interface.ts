import { Role } from "@prisma/client";

export interface AuthUser {
  userId: string;
  role: Role;
  doctorId?: string;
  patientId?: string;
}
