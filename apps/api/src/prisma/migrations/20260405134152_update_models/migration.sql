/*
  Warnings:

  - The values [CAREGIVER,COORDINATOR] on the enum `CaregiverRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `task_instance_id` on the `action_records` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `allergies` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `emergency_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `preferred` on the `emergency_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `resident_task_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `resident_id` on the `resident_task_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `task_template_id` on the `resident_task_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the column `guardianUserId` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the column `primaryCaregiverId` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the column `agency_id` on the `task_templates` table. All the data in the column will be lost.
  - You are about to drop the column `risk_level` on the `task_templates` table. All the data in the column will be lost.
  - You are about to drop the `ChecklistItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_instances` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `task_id` to the `action_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residentId` to the `resident_task_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskTemplateId` to the `resident_task_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `residents` table without a default value. This is not possible if the table is not empty.
  - Made the column `care_home_agency_id` on table `residents` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `agencyId` to the `task_templates` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `task_templates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CaregiverRole_new" AS ENUM ('PRACTICAL_NURSE', 'DOCTOR', 'NURSE', 'HEAD_NURSE');
ALTER TABLE "caregivers" ALTER COLUMN "role" TYPE "CaregiverRole_new" USING ("role"::text::"CaregiverRole_new");
ALTER TYPE "CaregiverRole" RENAME TO "CaregiverRole_old";
ALTER TYPE "CaregiverRole_new" RENAME TO "CaregiverRole";
DROP TYPE "public"."CaregiverRole_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TaskFrequency" ADD VALUE 'WEEKLY';

-- DropForeignKey
ALTER TABLE "ChecklistItem" DROP CONSTRAINT "ChecklistItem_taskId_fkey";

-- DropForeignKey
ALTER TABLE "action_records" DROP CONSTRAINT "action_records_task_instance_id_fkey";

-- DropForeignKey
ALTER TABLE "resident_task_assignments" DROP CONSTRAINT "resident_task_assignments_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "resident_task_assignments" DROP CONSTRAINT "resident_task_assignments_task_template_id_fkey";

-- DropForeignKey
ALTER TABLE "residents" DROP CONSTRAINT "residents_care_home_agency_id_fkey";

-- DropForeignKey
ALTER TABLE "task_instances" DROP CONSTRAINT "task_instances_task_template_id_fkey";

-- DropForeignKey
ALTER TABLE "task_instances" DROP CONSTRAINT "task_instances_visit_id_fkey";

-- DropForeignKey
ALTER TABLE "task_templates" DROP CONSTRAINT "task_templates_agency_id_fkey";

-- AlterTable
ALTER TABLE "action_records" DROP COLUMN "task_instance_id",
ADD COLUMN     "task_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "allergies" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "emergency_contacts" DROP COLUMN "email",
DROP COLUMN "preferred",
ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "resident_task_assignments" DROP COLUMN "is_active",
DROP COLUMN "resident_id",
DROP COLUMN "task_template_id",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "residentId" TEXT NOT NULL,
ADD COLUMN     "taskTemplateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "residents" DROP COLUMN "createdAt",
DROP COLUMN "guardianUserId",
DROP COLUMN "primaryCaregiverId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "care_home_agency_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "task_templates" DROP COLUMN "agency_id",
DROP COLUMN "risk_level",
ADD COLUMN     "agencyId" INTEGER NOT NULL,
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
DROP COLUMN "category",
ADD COLUMN     "category" "TaskCategory" NOT NULL;

-- DropTable
DROP TABLE "ChecklistItem";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "task_instances";

-- CreateTable
CREATE TABLE "checklist_template_items" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "taskTemplateId" INTEGER NOT NULL,

    CONSTRAINT "checklist_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "template_id" INTEGER,
    "resident_id" TEXT NOT NULL,
    "visit_id" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "TaskPriority" NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "completion_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "taskId" TEXT NOT NULL,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_resident_id_idx" ON "tasks"("resident_id");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_care_home_agency_id_fkey" FOREIGN KEY ("care_home_agency_id") REFERENCES "care_home_agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_templates" ADD CONSTRAINT "task_templates_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "care_home_agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_template_items" ADD CONSTRAINT "checklist_template_items_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "task_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_task_assignments" ADD CONSTRAINT "resident_task_assignments_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("residentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_task_assignments" ADD CONSTRAINT "resident_task_assignments_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "task_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "task_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("residentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visits"("visit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_records" ADD CONSTRAINT "action_records_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
