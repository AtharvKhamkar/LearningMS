/*
  Warnings:

  - A unique constraint covering the columns `[course_id,user_id]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_course_id_user_id_key" ON "Rating"("course_id", "user_id");
