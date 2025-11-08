-- CreateEnum
CREATE TYPE "BackgroundCheckStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('offline', 'online', 'busy');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('independent', 'needs_assistant', 'wheelchair');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('elder', 'family', 'caregiver', 'admin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other', 'pnts');

-- CreateTable
CREATE TABLE "caregiverprofile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bio" TEXT,
    "availability_status" "Availability" NOT NULL DEFAULT 'offline',
    "hourly_rate" DECIMAL(10,2),
    "verified" BOOLEAN DEFAULT false,
    "background_check_status" "BackgroundCheckStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caregiverprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elderprofile" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE,
    "address" TEXT,
    "phone" VARCHAR(30),
    "medical_notes" TEXT,
    "mobility_level" "MobilityLevel" NOT NULL DEFAULT 'independent',
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "elderprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emailverificationcode" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "verification_title" VARCHAR(200),
    "code" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emailverificationcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familyelderlink" (
    "id" SERIAL NOT NULL,
    "family_member_id" INTEGER NOT NULL,
    "elder_id" INTEGER NOT NULL,
    "relationship" VARCHAR(50),
    "is_primary_contact" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "familyelderlink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "familymemberprofile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "relationship_to_elder" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "familymemberprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicecategories" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicecategories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "servicetasks" (
    "service_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicetasks_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'family',
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(30),
    "password_hash" TEXT,
    "date_of_birth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100) DEFAULT 'Finland',
    "is_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "email_verified" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "familyelderlink_family_member_id_elder_id_key" ON "familyelderlink"("family_member_id", "elder_id");

-- CreateIndex
CREATE UNIQUE INDEX "familymemberprofile_user_id_key" ON "familymemberprofile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "servicecategories_category_name_key" ON "servicecategories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "servicetasks_category_id_service_name_key" ON "servicetasks"("category_id", "service_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "caregiverprofile" ADD CONSTRAINT "caregiverprofile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "emailverificationcode" ADD CONSTRAINT "emailverificationcode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "familyelderlink" ADD CONSTRAINT "familyelderlink_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elderprofile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "familyelderlink" ADD CONSTRAINT "familyelderlink_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "familymemberprofile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "familymemberprofile" ADD CONSTRAINT "familymemberprofile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "servicetasks" ADD CONSTRAINT "servicetasks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "servicecategories"("category_id") ON DELETE CASCADE ON UPDATE NO ACTION;

