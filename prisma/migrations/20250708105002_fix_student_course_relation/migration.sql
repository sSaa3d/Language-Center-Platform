/*
  Warnings:

  - You are about to drop the column `students` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastApprovedAt` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastApprovedCourseId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `enrollmentDate` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placementTestLevel` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "students";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "age",
DROP COLUMN "lastApprovedAt",
DROP COLUMN "lastApprovedCourseId",
ADD COLUMN     "approvedDate" TIMESTAMP(3),
ADD COLUMN     "enrollmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "placementTestLevel" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
