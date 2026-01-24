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
      firstName: "Hamid",
      lastName: "Aebadi",
      passwordHash: familyPassword,
      role: UserRole.FAMILY,
      isVerified: true,
      familyMemberProfile: {
        create: {
          phoneNumber: "+358401234567",
          gender: Gender.MALE,
          city: "Helsinki",
        },
      },
    },
    include: { familyMemberProfile: true },
  });

  const caregiverUser = await prisma.user.create({
    data: {
      email: "marko.laine@snaptuki.com",
      passwordHash: caregiverPassword,
      firstName: "Marko",
      lastName: "Laine",
      role: UserRole.CAREGIVER,
      isVerified: true,
      caregiverProfile: {
        create: {
          phoneNumber: "+358409876543",
          gender: Gender.MALE,
          availabilityStatus: Availability.online,
          hourlyRate: 25,
          verified: true,
        },
      },
    },
    include: { caregiverProfile: true },
  });

  /* ---------------- ELDER ---------------- */

  const elder = await prisma.elderProfile.create({
    data: {
      firstName: "Matti",
      lastName: "Korhonen",
      dateOfBirth: new Date("1945-05-10"),
      mobilityLevel: MobilityLevel.needs_assistant,
      medicalNotes: "Diabetes, mild memory loss",
      
    },
  });

  /* ---------------- SERVICE CATEGORIES ---------------- */




  for (const category of careServices.service_categories) {
    await prisma.serviceCategory.create({
      data: {
        categoryName: category.name,
        //description: category.description,
        serviceTasks: {
          createMany: {
            data: category.services.map((task: any) => ({
              serviceName: task,
            })),
          },
        },
      },
    });
  }

  const medicalCare = await prisma.serviceCategory.create({
    data: {
      categoryName: "Medical Care",
      description: "Medical-related home care",
      serviceTasks: {
        createMany: {
          data: [
            { serviceName: "Medication reminder" },
            { serviceName: "Blood pressure monitoring" },
            { serviceName: "Insulin injection support" },
          ],
        },
      },
    },
  });

  const householdHelp = await prisma.serviceCategory.create({
    data: {
      categoryName: "Household Help",
      description: "Help with daily household tasks",
      serviceTasks: {
        createMany: {
          data: [
            { serviceName: "Meal preparation" },
            { serviceName: "Light cleaning" },
            { serviceName: "Laundry assistance" },
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
