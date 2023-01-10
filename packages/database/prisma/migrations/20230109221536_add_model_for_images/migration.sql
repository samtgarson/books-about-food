/*
  Warnings:

  - You are about to drop the column `cover_url` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `image_urls` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `publishers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[logo_id]` on the table `publishers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "cover_url",
DROP COLUMN "image_urls";

-- AlterTable
ALTER TABLE "publishers" DROP COLUMN "logo_url",
ADD COLUMN     "logo_id" UUID;

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caption" TEXT,
    "cover_for_id" UUID,
    "preview_for_id" UUID,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_cover_for_id_key" ON "images"("cover_for_id");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_logo_id_key" ON "publishers"("logo_id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_cover_for_id_fkey" FOREIGN KEY ("cover_for_id") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_preview_for_id_fkey" FOREIGN KEY ("preview_for_id") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publishers" ADD CONSTRAINT "publishers_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
