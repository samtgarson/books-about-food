/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_url_key" ON "images"("url");
