-- AlterTable
ALTER TABLE "caregiver_profiles" ADD COLUMN     "completed_jobs_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "internal_notes" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "profile_photo_url" TEXT,
ADD COLUMN     "rating" DECIMAL(3,2) DEFAULT 0,
ADD COLUMN     "ssn" TEXT;

-- CreateTable
CREATE TABLE "caregiver_education" (
    "id" SERIAL NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "degree" VARCHAR(200) NOT NULL,
    "institution" VARCHAR(200) NOT NULL,
    "graduation_year" INTEGER NOT NULL,

    CONSTRAINT "caregiver_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_experience" (
    "id" SERIAL NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "organization" VARCHAR(100),
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER,
    "description" TEXT,

    CONSTRAINT "caregiver_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_certificates" (
    "id" SERIAL NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "file_url" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3),

    CONSTRAINT "caregiver_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caregiver_documents" (
    "id" SERIAL NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caregiver_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "booking_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaregiverProfileToServiceTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CaregiverProfileToServiceTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CaregiverProfileToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CaregiverProfileToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_title_key" ON "skills"("title");

-- CreateIndex
CREATE INDEX "_CaregiverProfileToServiceTask_B_index" ON "_CaregiverProfileToServiceTask"("B");

-- CreateIndex
CREATE INDEX "_CaregiverProfileToSkill_B_index" ON "_CaregiverProfileToSkill"("B");

-- AddForeignKey
ALTER TABLE "caregiver_education" ADD CONSTRAINT "caregiver_education_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_experience" ADD CONSTRAINT "caregiver_experience_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_certificates" ADD CONSTRAINT "caregiver_certificates_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caregiver_documents" ADD CONSTRAINT "caregiver_documents_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaregiverProfileToServiceTask" ADD CONSTRAINT "_CaregiverProfileToServiceTask_A_fkey" FOREIGN KEY ("A") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaregiverProfileToServiceTask" ADD CONSTRAINT "_CaregiverProfileToServiceTask_B_fkey" FOREIGN KEY ("B") REFERENCES "servicetasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaregiverProfileToSkill" ADD CONSTRAINT "_CaregiverProfileToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaregiverProfileToSkill" ADD CONSTRAINT "_CaregiverProfileToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
