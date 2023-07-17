/*
  Warnings:

  - A unique constraint covering the columns `[publisher_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "publisher_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "users_publisher_id_key" ON "users"("publisher_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
