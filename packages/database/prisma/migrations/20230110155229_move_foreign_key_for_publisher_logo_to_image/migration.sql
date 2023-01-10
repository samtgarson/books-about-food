/*
  Warnings:

  - You are about to drop the column `logo_id` on the `publishers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publisher_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "publishers" DROP CONSTRAINT "publishers_logo_id_fkey";

-- DropIndex
DROP INDEX "publishers_logo_id_key";

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "publisher_id" UUID;

-- AlterTable
ALTER TABLE "publishers" DROP COLUMN "logo_id";

-- CreateIndex
CREATE UNIQUE INDEX "images_publisher_id_key" ON "images"("publisher_id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
