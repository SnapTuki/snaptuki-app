/*
  Warnings:

  - The primary key for the `residents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `residentId` on the `residents` table. All the data in the column will be lost.
  - The required column `resident_id` was added to the `residents` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "allergies" DROP CONSTRAINT "allergies_residentId_fkey";

-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_residentId_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_residentId_fkey";

-- DropForeignKey
ALTER TABLE "resident_task_assignments" DROP CONSTRAINT "resident_task_assignments_residentId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_resident_id_fkey";

-- AlterTable
ALTER TABLE "residents" DROP CONSTRAINT "residents_pkey",
DROP COLUMN "residentId",
ADD COLUMN     "resident_id" TEXT NOT NULL,
ADD CONSTRAINT "residents_pkey" PRIMARY KEY ("resident_id");

-- AddForeignKey
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("resident_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("resident_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("resident_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_task_assignments" ADD CONSTRAINT "resident_task_assignments_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("resident_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("resident_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("resident_id") ON DELETE RESTRICT ON UPDATE CASCADE;
