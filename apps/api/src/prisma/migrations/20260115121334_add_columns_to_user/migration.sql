/*
  Warnings:

  - You are about to drop the column `first_name` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `caregiver_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `familymemberprofile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `familymemberprofile` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `password_hash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "caregiver_profiles" DROP COLUMN "first_name",
DROP COLUMN "last_name";

-- AlterTable
ALTER TABLE "familymemberprofile" DROP COLUMN "first_name",
DROP COLUMN "last_name";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL,
ALTER COLUMN "password_hash" SET NOT NULL;
