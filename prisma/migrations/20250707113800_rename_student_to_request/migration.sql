/*
  Warnings:

  - You are about to rename the `Student` table to `Request`. If the table is not empty, all the data it contains will be preserved.

*/
-- RenameTable
ALTER TABLE "Student" RENAME TO "Request";

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
