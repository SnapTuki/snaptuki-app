/*
  Warnings:

  - You are about to drop the column `completedAt` on the `checklist_items` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `checklist_items` table. All the data in the column will be lost.
  - You are about to drop the column `isRequired` on the `checklist_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "checklist_items" DROP COLUMN "completedAt",
DROP COLUMN "isCompleted",
DROP COLUMN "isRequired";
