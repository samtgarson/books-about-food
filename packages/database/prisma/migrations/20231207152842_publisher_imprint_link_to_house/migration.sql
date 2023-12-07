/*
  Warnings:

  - You are about to drop the column `imprint` on the `publishers` table. All the data in the column will be lost.
  - You are about to drop the column `publisher_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_publisher_id_fkey";

-- DropIndex
DROP INDEX "users_publisher_id_key";

-- AlterTable
ALTER TABLE "publishers" ADD COLUMN "imprint_id" UUID;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "publisher_id";

-- AddForeignKey
ALTER TABLE "publishers" ADD CONSTRAINT "publishers_imprint_id_fkey" FOREIGN KEY ("imprint_id") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE publishers
SET imprint_id = i.id
FROM publishers as i
WHERE i.name = publishers.imprint;


ALTER TABLE "publishers" DROP COLUMN "imprint";
