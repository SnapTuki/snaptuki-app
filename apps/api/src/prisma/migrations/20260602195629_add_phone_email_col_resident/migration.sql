/*
  Warnings:

  - Made the column `phone` on table `residents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "residents" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DEFAULT 'Unknown',
ALTER COLUMN "email" SET DEFAULT 'Unknown';
