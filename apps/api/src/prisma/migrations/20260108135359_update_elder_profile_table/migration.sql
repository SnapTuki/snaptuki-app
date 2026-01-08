/*
  Warnings:

  - You are about to drop the column `notes` on the `elderprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "elderprofile" DROP COLUMN "notes",
ADD COLUMN     "country" TEXT;
