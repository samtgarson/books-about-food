/*
  Warnings:

  - You are about to drop the column `roles` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "roles";

-- CreateTable
CREATE TABLE "_JobToProfile" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobToProfile_AB_unique" ON "_JobToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToProfile_B_index" ON "_JobToProfile"("B");

-- AddForeignKey
ALTER TABLE "_JobToProfile" ADD CONSTRAINT "_JobToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToProfile" ADD CONSTRAINT "_JobToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
