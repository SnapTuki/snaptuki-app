/*
  Warnings:

  - You are about to drop the `emailverificationcode` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- DropForeignKey
ALTER TABLE "emailverificationcode" DROP CONSTRAINT "emailverificationcode_user_id_fkey";

-- DropTable
DROP TABLE "emailverificationcode";

-- CreateTable
CREATE TABLE "authtokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "verification_title" VARCHAR(200),
    "code" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "type" "TokenType" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authtokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "authtokens" ADD CONSTRAINT "authtokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
