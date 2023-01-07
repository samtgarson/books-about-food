/*
  Warnings:

  - You are about to drop the column `published_on` on the `books` table. All the data in the column will be lost.
  - Added the required column `release_date` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" RENAME COLUMN "published_on" TO "release_date";
