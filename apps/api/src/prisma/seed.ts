import { PrismaClient, UserRole, MobilityLevel, BookingStatus } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /* ---------------- USERS ---------------- */

  const familyUser = await prisma.user.create({
    data: {
      email: "sara.mayar@gmail.com",
      password_hash: "1234",
      role: UserRole.FAMILY,
    },
  });

  const caregiverUser = await prisma.user.create({
    data: {
      email: "minna.cari@gmail.com",
      password_hash: "1234",
      role: UserRole.CAREGIVER,
    },
  });

  /* ---------------- PROFILES ---------------- */

  const familyProfile = await prisma.familymemberProfile.create({
    data: {
      user_id: familyUser.user_id,
      first_name: "Sara",
      last_name: "Mayar",
      phone_number: "0401234567",
    },
  });

  const caregiverProfile = await prisma.caregiverProfile.create({
    data: {
      user_id: caregiverUser.user_id,
      first_name: "Minna",
      last_name: "Cari",
      availability_status: "online",
    },
  });

  /* ---------------- ELDER ---------------- */

  const elder = await prisma.elderProfile.create({
    data: {
      first_name: "Liisa",
      last_name: "Korhonen",
      mobility_level: MobilityLevel.needs_assistant,
      medical_notes: "Diabetes Type 2",
    },
  });

  await prisma.familyWithElder.create({
    data: {
      family_member_id: familyProfile.id,
      elder_id: elder.id,
      relationship: "Mother",
    },
  });

  /* ---------------- SERVICES ---------------- */

  const category = await prisma.serviceCategory.create({
    data: {
      category_name: "Daily Care",
    },
  });

  const service = await prisma.serviceTask.create({
    data: {
      category_id: category.category_id,
      service_name: "Morning Assistance",
      description: "Help with morning routine",
    },
  });

  /* ---------------- BOOKING ---------------- */

  await prisma.booking.create({
    data: {
      family_member_id: familyProfile.id,
      caregiver_id: caregiverProfile.id,
      elder_id: elder.id,
      care_service_id: service.id,
      status: BookingStatus.CONFIRMED,
      start_time: new Date(),
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000),
      total_price: 50,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });