/*
  Warnings:

  - A unique constraint covering the columns `[profile_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "profile_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "images_profile_id_key" ON "images"("profile_id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
