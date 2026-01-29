import { PrismaClient } from "../generated/prisma";
import { UserRole, Gender, MobilityLevel, Availability, BackgroundCheckStatus } from "../generated/prisma";
import bcrypt from "bcrypt";
import careServices from "./careservice.json";
import caregiversData from "./caregivers.json"; // Ensure this file exists

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Service Categories & Tasks FIRST
  // We need these to exist so we can link caregivers to them
  console.log("... Seeding Service Categories");
  for (const category of careServices.service_categories) {
    await prisma.serviceCategory.upsert({
      where: { categoryName: category.name },
      update: {}, // No update needed if exists
      create: {
        categoryName: category.name,
        // Create tasks inline
        serviceTasks: {
          create: category.services.map((serviceName: string) => ({
            serviceName: serviceName,
          })),
        },
      },
    });
  }

  // 2. Create Base Users (Family & Caregiver placeholders from original seed)
  const familyPassword = await bcrypt.hash("Awmpp19m461", 10);
  const baseCaregiverPassword = await bcrypt.hash("Awmpp19m461", 10);

  // Existing Family User
  await prisma.user.upsert({
    where: { email: "hamidebadi1996@yahoo.com" },
    update: {},
    create: {
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
  });

  // Existing Caregiver User
  await prisma.user.upsert({
    where: { email: "marko.laine@snaptuki.com" },
    update: {},
    create: {
      email: "marko.laine@snaptuki.com",
      passwordHash: baseCaregiverPassword,
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
  });

  // 3. Seed Elder (Placeholder)
  await prisma.elderProfile.create({
    data: {
      firstName: "Matti",
      lastName: "Korhonen",
      dateOfBirth: new Date("1945-05-10"),
      mobilityLevel: MobilityLevel.needs_assistant,
      medicalNotes: "Diabetes, mild memory loss",
    },
  });

  // ---------------------------------------------------------
  // 4. SEED CAREGIVERS FROM JSON
  // ---------------------------------------------------------
  console.log(`... Seeding ${caregiversData.length} Detailed Caregivers`);

  for (const caregiver of caregiversData) {
    // Hash password
    const hashedPassword = await bcrypt.hash(caregiver.user.password, 10);

    // Prepare Relation Data
    
    // Education
    const educationData = caregiver.profile.education.map((edu: any) => ({
      degree: edu.degree,
      institution: edu.institution,
      graduationYear: edu.graduationYear,
    }));

    // Experience
    const experienceData = caregiver.profile.experience.map((exp: any) => ({
      role: exp.role,
      organization: exp.organization || "Private",
      startYear: exp.startYear,
      endYear: exp.endYear,
      description: exp.description,
    }));

    // Skills (Connect or Create)
    const skillConnects = caregiver.profile.skills.map((skillName: string) => ({
      where: { title: skillName },
      create: { title: skillName },
    }));

    // Services (Connect only - they must exist from step 1)
    // We need to find the ServiceTask IDs based on the names provided in JSON
    // Since Prisma connect needs unique identifiers, we first fetch the tasks.
    const serviceNames = caregiver.profile.offeredServices;
    const servicesToConnect = await prisma.serviceTask.findMany({
      where: {
        serviceName: { in: serviceNames },
      },
      select: { serviceId: true }, // Select ID to connect
    });

    // Create User & Profile Transactionally
    await prisma.user.create({
      data: {
        email: caregiver.user.email,
        firstName: caregiver.user.firstName,
        lastName: caregiver.user.lastName,
        passwordHash: hashedPassword,
        role: UserRole.CAREGIVER,
        isVerified: true,
        
        caregiverProfile: {
          create: {
            // Basic Info
            phoneNumber: caregiver.profile.phoneNumber,
            dateOfBirth: new Date(caregiver.profile.dateOfBirth),
            gender: caregiver.profile.gender as Gender,
            address: caregiver.profile.address,
            city: caregiver.profile.city,
            country: caregiver.profile.country,
            languages: caregiver.profile.languages,
            profilePhotoUrl: caregiver.profile.profilePhotoUrl,
            
            // Professional Info
            bio: caregiver.profile.bio,
            hourlyRate: caregiver.profile.hourlyRate,
            availabilityStatus: caregiver.profile.availabilityStatus as Availability,
            verified: caregiver.profile.verified,
            backgroundCheckStatus: caregiver.profile.backgroundCheckStatus as BackgroundCheckStatus,
            ssn: caregiver.profile.ssn,
            internalNotes: caregiver.profile.internalNotes,
            rating: caregiver.profile.rating,
            completedJobsCount: caregiver.profile.completedJobsCount,

            // Relations (Nested Creates)
            education: {
              create: educationData,
            },
            experience: {
              create: experienceData,
            },
            
            // Relations (Connects)
            skills: {
              connectOrCreate: skillConnects,
            },
            offeredServices: {
              connect: servicesToConnect.map(s => ({ serviceId: s.serviceId })),
            },
          },
        },
      },
    });
  }

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