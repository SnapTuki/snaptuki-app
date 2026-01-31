/*
  Warnings:

  - You are about to drop the column `care_service_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to alter the column `total_price` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to drop the column `caregiver_id` on the `caretaskbooks` table. All the data in the column will be lost.
  - You are about to drop the column `elder_id` on the `caretaskbooks` table. All the data in the column will be lost.
  - You are about to drop the column `caregiver_notes` on the `caretasks` table. All the data in the column will be lost.
  - You are about to drop the column `completed_at` on the `caretasks` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `caretasks` table. All the data in the column will be lost.
  - You are about to drop the column `is_mandatory` on the `caretasks` table. All the data in the column will be lost.
  - You are about to drop the column `task_book_id` on the `caretasks` table. All the data in the column will be lost.
  - You are about to drop the column `task_order` on the `caretasks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `caretasks` table. All the data in the column will be lost.
  - Made the column `created_at` on table `bookings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `bookings` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `taskBookId` to the `caretasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `caretasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_care_service_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_elder_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_family_member_id_fkey";

-- DropForeignKey
ALTER TABLE "caretaskbooks" DROP CONSTRAINT "caretaskbooks_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "caretaskbooks" DROP CONSTRAINT "caretaskbooks_caregiver_id_fkey";

-- DropForeignKey
ALTER TABLE "caretaskbooks" DROP CONSTRAINT "caretaskbooks_elder_id_fkey";

-- DropForeignKey
ALTER TABLE "caretasks" DROP CONSTRAINT "caretasks_task_book_id_fkey";

-- DropIndex
DROP INDEX "caretasks_task_book_id_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "care_service_id",
ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "caretaskbooks" DROP COLUMN "caregiver_id",
DROP COLUMN "elder_id";

-- AlterTable
ALTER TABLE "caretasks" DROP COLUMN "caregiver_notes",
DROP COLUMN "completed_at",
DROP COLUMN "created_at",
DROP COLUMN "is_mandatory",
DROP COLUMN "task_book_id",
DROP COLUMN "task_order",
DROP COLUMN "updated_at",
ADD COLUMN     "caregiverNotes" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isMandatory" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "taskBookId" INTEGER NOT NULL,
ADD COLUMN     "taskOrder" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "caretasks_taskBookId_idx" ON "caretasks"("taskBookId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "familymemberprofile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caretaskbooks" ADD CONSTRAINT "caretaskbooks_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caretasks" ADD CONSTRAINT "caretasks_taskBookId_fkey" FOREIGN KEY ("taskBookId") REFERENCES "caretaskbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
