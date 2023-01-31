/*
  Warnings:

  - Made the column `release_date` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pages` on table `books` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "books" ALTER COLUMN "release_date" SET NOT NULL,
ALTER COLUMN "pages" SET NOT NULL;
