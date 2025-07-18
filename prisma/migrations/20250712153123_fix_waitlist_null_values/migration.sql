/*
  Warnings:

  - Made the column `waitlist` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- First, update existing NULL values to 0
UPDATE "Course" SET "waitlist" = 0 WHERE "waitlist" IS NULL;

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "waitlist" SET NOT NULL,
ALTER COLUMN "waitlist" SET DEFAULT 0;
