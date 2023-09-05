/*
  Warnings:

  - A unique constraint covering the columns `[profile_id]` on the table `featured_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "featured_profiles_profile_id_key" ON "featured_profiles"("profile_id");
