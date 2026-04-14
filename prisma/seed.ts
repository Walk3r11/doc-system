import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);

  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@example.com" },
    update: {},
    create: {
      email: "doctor@example.com",
      passwordHash,
      role: Role.DOCTOR,
      doctor: {
        create: {
          name: "Dr. Ivan Petrov",
          email: "doctor@example.com",
          address: "Sofia, bul. Bulgaria 1",
        },
      },
    },
    include: { doctor: true },
  });

  if (!doctorUser.doctor) {
    return;
  }

  await prisma.user.upsert({
    where: { email: "patient@example.com" },
    update: {},
    create: {
      email: "patient@example.com",
      passwordHash,
      role: Role.PATIENT,
      patient: {
        create: {
          name: "Maria Ivanova",
          email: "patient@example.com",
          phone: "+359888111222",
          doctorId: doctorUser.doctor.id,
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
