-- AlterTable
ALTER TABLE "Rejection" ADD COLUMN     "lastRejectedAt" TIMESTAMP(3),
ADD COLUMN     "lastRejectedCourseId" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "lastApprovedAt" TIMESTAMP(3),
ADD COLUMN     "lastApprovedCourseId" INTEGER;
