/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "path" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "images_path_key" ON "images"("path");

update images
set path = url;
