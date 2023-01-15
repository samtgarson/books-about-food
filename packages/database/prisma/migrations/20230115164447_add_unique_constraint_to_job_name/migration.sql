/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jobs_name_key" ON "jobs"("name");
