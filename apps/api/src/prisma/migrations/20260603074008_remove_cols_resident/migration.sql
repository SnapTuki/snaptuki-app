/*
  Warnings:

  - You are about to drop the column `email` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `residents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "residents" DROP COLUMN "email",
DROP COLUMN "phone";
