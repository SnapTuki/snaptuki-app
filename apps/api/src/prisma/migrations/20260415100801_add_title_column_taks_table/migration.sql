/*
  Warnings:

  - Added the required column `title` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigned_caregiver_id_fkey";

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_caregiver_id_fkey" FOREIGN KEY ("assigned_caregiver_id") REFERENCES "caregivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
