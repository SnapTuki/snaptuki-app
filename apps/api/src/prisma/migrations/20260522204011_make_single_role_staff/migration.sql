/*
  Warnings:

  - You are about to drop the column `roles` on the `staffs` table. All the data in the column will be lost.
  - Added the required column `role` to the `staffs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "roles",
ADD COLUMN     "role" "ROLE" NOT NULL;
