/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "slug" TEXT;

UPDATE "tags" SET "slug" = replace(replace(lower("name"), '& ', ''), ' ', '-');

ALTER TABLE "tags" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");
