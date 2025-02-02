/*
  Warnings:

  - You are about to drop the column `until` on the `collections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collections" DROP COLUMN "until",
ADD COLUMN     "publisher_featured" BOOLEAN NOT NULL DEFAULT false;
