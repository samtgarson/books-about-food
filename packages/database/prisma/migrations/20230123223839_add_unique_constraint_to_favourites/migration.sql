/*
  Warnings:

  - A unique constraint covering the columns `[profile_id,user_id]` on the table `favourites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "favourites_profile_id_user_id_key" ON "favourites"("profile_id", "user_id");
