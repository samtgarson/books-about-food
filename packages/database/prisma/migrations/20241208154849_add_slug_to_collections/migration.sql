/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `collections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "slug" TEXT;

UPDATE "collections" SET "slug" = replace(replace(replace(lower("title"), '& ', ''), ' ', '-'), '/ ', '');

ALTER TABLE "collections" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");
