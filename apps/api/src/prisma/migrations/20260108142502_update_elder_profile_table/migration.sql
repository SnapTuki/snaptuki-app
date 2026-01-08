/*
  Warnings:

  - You are about to drop the `caregiverprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `elderprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `familyelderlink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_elder_id_fkey";

-- DropForeignKey
ALTER TABLE "caregiverprofile" DROP CONSTRAINT "caregiverprofile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "familyelderlink" DROP CONSTRAINT "familyelderlink_elder_id_fkey";

-- DropForeignKey
ALTER TABLE "familyelderlink" DROP CONSTRAINT "familyelderlink_family_member_id_fkey";

-- DropTable
DROP TABLE "caregiverprofile";

-- DropTable
DROP TABLE "elderprofile";

-- DropTable
DROP TABLE "familyelderlink";

-- CreateTable
CREATE TABLE "caregiver_profiles" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone_number" VARCHAR(30),
    "date_of_birth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100) DEFAULT 'Finland',
    "bio" TEXT,
    "availability_status" "Availability" NOT NULL DEFAULT 'offline',
    "hourly_rate" DECIMAL(10,2),
    "verified" BOOLEAN DEFAULT false,
    "background_check_status" "BackgroundCheckStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "caregiver_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elder_profiles" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE,
    "address" VARCHAR(100),
    "postal_code" VARCHAR(10),
    "city" VARCHAR(100),
    "country" TEXT,
    "phone" VARCHAR(30),
    "medical_notes" TEXT,
    "mobility_level" "MobilityLevel" NOT NULL DEFAULT 'independent',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "elder_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_with_elders" (
    "id" SERIAL NOT NULL,
    "family_member_id" INTEGER NOT NULL,
    "elder_id" INTEGER NOT NULL,
    "relationship" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_with_elders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_profiles_phone_number_key" ON "caregiver_profiles"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_user_id" ON "caregiver_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "caregiver_profiles" ADD CONSTRAINT "caregiver_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_with_elders" ADD CONSTRAINT "family_with_elders_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "familymemberprofile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_with_elders" ADD CONSTRAINT "family_with_elders_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
