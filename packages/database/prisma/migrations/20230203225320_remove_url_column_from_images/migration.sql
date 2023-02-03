/*
  Warnings:

  - You are about to drop the column `url` on the `images` table. All the data in the column will be lost.
  - Made the column `path` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "images_url_key";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "url",
ALTER COLUMN "path" SET NOT NULL;
