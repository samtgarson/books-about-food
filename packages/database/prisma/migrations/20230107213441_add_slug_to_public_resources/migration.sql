/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `publishers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "publishers" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_slug_key" ON "profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_slug_key" ON "publishers"("slug");
