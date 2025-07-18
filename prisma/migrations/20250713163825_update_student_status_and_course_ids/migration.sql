-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "enrolledCourseIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "status" SET DEFAULT 'active';
