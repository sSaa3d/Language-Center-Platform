/*
  Warnings:

  - You are about to drop the `Rejection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RejectedCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RejectedCourses" DROP CONSTRAINT "_RejectedCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_RejectedCourses" DROP CONSTRAINT "_RejectedCourses_B_fkey";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "approvedDate" TIMESTAMP(3),
ADD COLUMN     "rejectedDate" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE "Rejection";

-- DropTable
DROP TABLE "_RejectedCourses";
