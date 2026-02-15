/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('SUPER_ADMIN', 'AGENCY_STAFF', 'SUPERVISOR', 'CAREGIVER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "roles" "ROLE"[];

-- DropEnum
DROP TYPE "UserRole";
