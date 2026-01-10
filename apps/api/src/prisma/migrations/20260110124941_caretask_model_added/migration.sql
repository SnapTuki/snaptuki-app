-- CreateEnum
CREATE TYPE "CareTaskBookStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CareTaskStatus" AS ENUM ('PENDING', 'DONE', 'SKIPPED');

-- CreateTable
CREATE TABLE "caretaskbooks" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "caregiver_id" INTEGER NOT NULL,
    "elder_id" INTEGER NOT NULL,
    "status" "CareTaskBookStatus" NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(6),
    "completed_at" TIMESTAMP(6),
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "caretaskbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caretasks" (
    "id" SERIAL NOT NULL,
    "task_book_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "task_order" INTEGER NOT NULL,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT true,
    "status" "CareTaskStatus" NOT NULL DEFAULT 'PENDING',
    "completed_at" TIMESTAMP(6),
    "caregiver_notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "caretasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "caretaskbooks_booking_id_key" ON "caretaskbooks"("booking_id");

-- CreateIndex
CREATE INDEX "caretasks_task_book_id_idx" ON "caretasks"("task_book_id");

-- AddForeignKey
ALTER TABLE "caretaskbooks" ADD CONSTRAINT "caretaskbooks_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caretaskbooks" ADD CONSTRAINT "caretaskbooks_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "caregiver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caretaskbooks" ADD CONSTRAINT "caretaskbooks_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caretasks" ADD CONSTRAINT "caretasks_task_book_id_fkey" FOREIGN KEY ("task_book_id") REFERENCES "caretaskbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
