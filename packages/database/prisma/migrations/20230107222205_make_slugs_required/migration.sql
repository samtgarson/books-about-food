/*
  Warnings:

  - Made the column `slug` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `publishers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "books" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "publishers" ALTER COLUMN "slug" SET NOT NULL;
