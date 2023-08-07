/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `publishers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "publishers_name_key" ON "publishers"("name");
