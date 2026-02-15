/*
  Warnings:

  - The values [ELDER,FAMILY,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `availability_status` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `background_check_status` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `completed_jobs_count` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `hourly_rate` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `internal_notes` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `profile_photo_url` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `ssn` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `caregiver_profiles` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_CaregiverProfileToServiceTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CaregiverProfileToSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `authtokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caregiver_certificates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caregiver_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caregiver_education` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caregiver_experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caretaskbooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caretasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `elder_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_with_elders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `familymemberprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicecategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicetasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `skills` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employment_type` to the `caregiver_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_title` to the `caregiver_profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `caregiver_profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `caregiver_profiles` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `agency_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "TaskFrequency" AS ENUM ('DAILY', 'ON_DEMAND');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'AGENCY_ADMIN', 'SUPERVISOR', 'CAREGIVER');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_CaregiverProfileToServiceTask" DROP CONSTRAINT "_CaregiverProfileToServiceTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_CaregiverProfileToServiceTask" DROP CONSTRAINT "_CaregiverProfileToServiceTask_B_fkey";

-- DropForeignKey
ALTER TABLE "_CaregiverProfileToSkill" DROP CONSTRAINT "_CaregiverProfileToSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_CaregiverProfileToSkill" DROP CONSTRAINT "_CaregiverProfileToSkill_B_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_elder_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_family_member_id_fkey";

-- DropForeignKey
ALTER TABLE "caregiver_certificates" DROP CONSTRAINT "caregiver_certificates_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "caregiver_documents" DROP CONSTRAINT "caregiver_documents_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "caregiver_education" DROP CONSTRAINT "caregiver_education_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "caregiver_experience" DROP CONSTRAINT "caregiver_experience_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "caregiver_profiles" DROP CONSTRAINT "caregiver_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "caretaskbooks" DROP CONSTRAINT "caretaskbooks_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "caretasks" DROP CONSTRAINT "caretasks_taskBookId_fkey";

-- DropForeignKey
ALTER TABLE "family_with_elders" DROP CONSTRAINT "family_with_elders_elder_id_fkey";

-- DropForeignKey
ALTER TABLE "family_with_elders" DROP CONSTRAINT "family_with_elders_family_member_id_fkey";

-- DropForeignKey
ALTER TABLE "familymemberprofile" DROP CONSTRAINT "familymemberprofile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_reviewer_id_fkey";

-- DropForeignKey
ALTER TABLE "servicetasks" DROP CONSTRAINT "servicetasks_category_id_fkey";

-- DropIndex
DROP INDEX "caregiver_profiles_phone_number_key";

-- AlterTable
ALTER TABLE "caregiver_profiles" DROP COLUMN "address",
DROP COLUMN "availability_status",
DROP COLUMN "background_check_status",
DROP COLUMN "bio",
DROP COLUMN "city",
DROP COLUMN "completed_jobs_count",
DROP COLUMN "country",
DROP COLUMN "date_of_birth",
DROP COLUMN "gender",
DROP COLUMN "hourly_rate",
DROP COLUMN "internal_notes",
DROP COLUMN "languages",
DROP COLUMN "phone_number",
DROP COLUMN "profile_photo_url",
DROP COLUMN "rating",
DROP COLUMN "ssn",
DROP COLUMN "verified",
ADD COLUMN     "employment_type" TEXT NOT NULL,
ADD COLUMN     "job_title" TEXT NOT NULL,
ADD COLUMN     "license_number" TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "is_verified",
DROP COLUMN "user_id",
ADD COLUMN     "agency_id" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "first_name" SET DATA TYPE TEXT,
ALTER COLUMN "last_name" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_CaregiverProfileToServiceTask";

-- DropTable
DROP TABLE "_CaregiverProfileToSkill";

-- DropTable
DROP TABLE "authtokens";

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "caregiver_certificates";

-- DropTable
DROP TABLE "caregiver_documents";

-- DropTable
DROP TABLE "caregiver_education";

-- DropTable
DROP TABLE "caregiver_experience";

-- DropTable
DROP TABLE "caretaskbooks";

-- DropTable
DROP TABLE "caretasks";

-- DropTable
DROP TABLE "elder_profiles";

-- DropTable
DROP TABLE "family_with_elders";

-- DropTable
DROP TABLE "familymemberprofile";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "servicecategories";

-- DropTable
DROP TABLE "servicetasks";

-- DropTable
DROP TABLE "skills";

-- DropEnum
DROP TYPE "Availability";

-- DropEnum
DROP TYPE "BackgroundCheckStatus";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "CareTaskBookStatus";

-- DropEnum
DROP TYPE "CareTaskStatus";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "MobilityLevel";

-- DropEnum
DROP TYPE "TokenType";

-- CreateTable
CREATE TABLE "care_home_agencies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_home_agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "can_assign_tasks" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residents" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "room_number" TEXT NOT NULL,
    "agency_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" SERIAL NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "scheduled_start" TIMESTAMP(3) NOT NULL,
    "scheduled_end" TIMESTAMP(3) NOT NULL,
    "actual_start" TIMESTAMP(3),
    "actual_end" TIMESTAMP(3),
    "status" "VisitStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "frequency" "TaskFrequency" NOT NULL,
    "requires_input" BOOLEAN NOT NULL DEFAULT false,
    "input_schema" JSONB,
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "agency_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resident_task_assignments" (
    "id" SERIAL NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "task_template_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resident_task_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_instances" (
    "id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "task_template_id" INTEGER NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_records" (
    "id" SERIAL NOT NULL,
    "task_instance_id" INTEGER NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "value" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_profiles_user_id_key" ON "staff_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "care_home_agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_profiles" ADD CONSTRAINT "caregiver_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "care_home_agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_templates" ADD CONSTRAINT "task_templates_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "care_home_agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_task_assignments" ADD CONSTRAINT "resident_task_assignments_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_task_assignments" ADD CONSTRAINT "resident_task_assignments_task_template_id_fkey" FOREIGN KEY ("task_template_id") REFERENCES "task_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_instances" ADD CONSTRAINT "task_instances_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_instances" ADD CONSTRAINT "task_instances_task_template_id_fkey" FOREIGN KEY ("task_template_id") REFERENCES "task_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_records" ADD CONSTRAINT "action_records_task_instance_id_fkey" FOREIGN KEY ("task_instance_id") REFERENCES "task_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_records" ADD CONSTRAINT "action_records_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "caregiver_user_id" RENAME TO "caregiver_profiles_user_id_key";
