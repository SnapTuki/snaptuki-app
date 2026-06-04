/*
  Warnings:

  - A unique constraint covering the columns `[ssn]` on the table `residents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ssn` to the `residents` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `staffs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assigned_staff_id` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assigned_staff_id_fkey";

-- AlterTable
ALTER TABLE "residents" ADD COLUMN     "ssn" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "staffs" ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "assigned_staff_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "residents_ssn_key" ON "residents"("ssn");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "staffs"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
