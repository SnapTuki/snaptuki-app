-- CreateEnum
CREATE TYPE "ResidentStatus" AS ENUM ('ACTIVE', 'DISCHARGED');

-- AlterTable
ALTER TABLE "residents" ADD COLUMN     "status" "ResidentStatus" NOT NULL DEFAULT 'ACTIVE';
