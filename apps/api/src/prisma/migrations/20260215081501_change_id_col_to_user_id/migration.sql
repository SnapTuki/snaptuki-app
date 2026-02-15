/*
  Warnings:

  - The primary key for the `residents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `residents` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resident_id]` on the table `residents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resident_id` to the `residents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "caregiver_profiles" DROP CONSTRAINT "caregiver_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "resident_task_assignments" DROP CONSTRAINT "resident_task_assignments_resident_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_profiles" DROP CONSTRAINT "staff_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_resident_id_fkey";

-- AlterTable
ALTER TABLE "caregiver_profiles" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "resident_task_assignments" ALTER COLUMN "resident_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "residents" DROP CONSTRAINT "residents_pkey",
DROP COLUMN "id",
ADD COLUMN     "resident_id" TEXT NOT NULL,
ADD CONSTRAINT "residents_pkey" PRIMARY KEY ("resident_id");

-- AlterTable
ALTER TABLE "staff_profiles" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "visits" ALTER COLUMN "resident_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "residents_resident_id_key" ON "residents"("resident_id");

-- AddForeignKey
ALTER TABLE "caregiver_profiles" ADD CONSTRAINT "caregiver_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("resident_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resident_task_assignments" ADD CONSTRAINT "resident_task_assignments_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("resident_id") ON DELETE RESTRICT ON UPDATE CASCADE;
