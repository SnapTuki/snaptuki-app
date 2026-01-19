import { PrismaClient } from "../generated/prisma";
import { UserRole, Gender, MobilityLevel, Availability } from "../generated/prisma";
import bcrypt from "bcrypt";
import careServices from "./careservice.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /* ---------------- USERS ---------------- */

  const familyPassword = await bcrypt.hash("Awmpp19m461", 10);
  const caregiverPassword = await bcrypt.hash("Awmpp19m461", 10);

  const familyUser = await prisma.user.create({
    data: {
      email: "hamidebadi1996@yahoo.com",
      first_name: "Hamid",
      last_name: "Aebadi",
      password_hash: familyPassword,
      role: UserRole.FAMILY,
      is_verified: true,
      familymemberprofile: {
        create: {
          phone_number: "+358401234567",
          gender: Gender.MALE,
          city: "Helsinki",
        },
      },
    },
    include: { familymemberprofile: true },
  });

  const caregiverUser = await prisma.user.create({
    data: {
      email: "marko.laine@snaptuki.com",
      password_hash: caregiverPassword,
      first_name: "Marko",
      last_name: "Laine",
      role: UserRole.CAREGIVER,
      is_verified: true,
      caregiverprofile: {
        create: {
          phone_number: "+358409876543",
          gender: Gender.MALE,
          availability_status: Availability.online,
          hourly_rate: 25,
          verified: true,
        },
      },
    },
    include: { caregiverprofile: true },
  });

  /* ---------------- ELDER ---------------- */

  const elder = await prisma.elderProfile.create({
    data: {
      first_name: "Matti",
      last_name: "Korhonen",
      date_of_birth: new Date("1945-05-10"),
      mobility_level: MobilityLevel.needs_assistant,
      medical_notes: "Diabetes, mild memory loss",
      
    },
  });

  /* ---------------- SERVICE CATEGORIES ---------------- */




  for (const category of careServices.service_categories) {
    await prisma.serviceCategory.create({
      data: {
        category_name: category.name,
        //description: category.description,
        servicetasks: {
          createMany: {
            data: category.services.map((task: any) => ({
              service_name: task,
            })),
          },
        },
      },
    });
  }

  const medicalCare = await prisma.serviceCategory.create({
    data: {
      category_name: "Medical Care",
      description: "Medical-related home care",
      servicetasks: {
        createMany: {
          data: [
            { service_name: "Medication reminder" },
            { service_name: "Blood pressure monitoring" },
            { service_name: "Insulin injection support" },
          ],
        },
      },
    },
  });

  const householdHelp = await prisma.serviceCategory.create({
    data: {
      category_name: "Household Help",
      description: "Help with daily household tasks",
      servicetasks: {
        createMany: {
          data: [
            { service_name: "Meal preparation" },
            { service_name: "Light cleaning" },
            { service_name: "Laundry assistance" },
          ],
        },
      },
    },
  });

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
