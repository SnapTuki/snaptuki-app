/*
  Warnings:

  - The primary key for the `caregiver_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `staff_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_instances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - The primary key for the `visits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `visits` table. All the data in the column will be lost.
  - Added the required column `visit_id` to the `visits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "action_records" DROP CONSTRAINT "action_records_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "action_records" DROP CONSTRAINT "action_records_task_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "task_instances" DROP CONSTRAINT "task_instances_visit_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_caregiver_id_fkey";

-- AlterTable
ALTER TABLE "action_records" ALTER COLUMN "task_instance_id" SET DATA TYPE TEXT,
ALTER COLUMN "caregiver_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "caregiver_profiles" DROP CONSTRAINT "caregiver_profiles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "caregiver_profiles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "caregiver_profiles_id_seq";

-- AlterTable
ALTER TABLE "staff_profiles" DROP CONSTRAINT "staff_profiles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "staff_profiles_id_seq";

-- AlterTable
ALTER TABLE "task_instances" DROP CONSTRAINT "task_instances_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "visit_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "task_instances_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "task_instances_id_seq";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_active",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "agency_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "visits" DROP CONSTRAINT "visits_pkey",
DROP COLUMN "id",
ADD COLUMN     "visit_id" TEXT NOT NULL,
ALTER COLUMN "caregiver_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("visit_id");

-- CreateIndex
CREATE INDEX "task_instances_visit_id_idx" ON "task_instances"("visit_id");

-- CreateIndex
CREATE INDEX "task_instances_task_template_id_idx" ON "task_instances"("task_template_id");

-- CreateIndex
CREATE INDEX "users_agency_id_idx" ON "users"("agency_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "care_home_agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_instances" ADD CONSTRAINT "task_instances_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visits"("visit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_records" ADD CONSTRAINT "action_records_task_instance_id_fkey" FOREIGN KEY ("task_instance_id") REFERENCES "task_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_records" ADD CONSTRAINT "action_records_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
