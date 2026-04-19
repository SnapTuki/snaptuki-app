/*
  Warnings:

  - The `completion_notes` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "assigned_caregiver_id" TEXT,
ADD COLUMN     "description" TEXT,
DROP COLUMN "completion_notes",
ADD COLUMN     "completion_notes" TEXT[];

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_caregiver_id_fkey" FOREIGN KEY ("assigned_caregiver_id") REFERENCES "caregivers"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
