/*
  Warnings:

  - You are about to drop the `_ContributionToJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ContributionToJob" DROP CONSTRAINT "_ContributionToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContributionToJob" DROP CONSTRAINT "_ContributionToJob_B_fkey";

-- DropForeignKey
ALTER TABLE "_JobToProfile" DROP CONSTRAINT "_JobToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobToProfile" DROP CONSTRAINT "_JobToProfile_B_fkey";

-- DropTable
DROP TABLE "_ContributionToJob";

-- DropTable
DROP TABLE "_JobToProfile";

-- CreateTable
CREATE TABLE "_profiles_jobs" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_contributions_jobs" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_profiles_jobs_AB_unique" ON "_profiles_jobs"("A", "B");

-- CreateIndex
CREATE INDEX "_profiles_jobs_B_index" ON "_profiles_jobs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_contributions_jobs_AB_unique" ON "_contributions_jobs"("A", "B");

-- CreateIndex
CREATE INDEX "_contributions_jobs_B_index" ON "_contributions_jobs"("B");

-- AddForeignKey
ALTER TABLE "_profiles_jobs" ADD CONSTRAINT "_profiles_jobs_A_fkey" FOREIGN KEY ("A") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_jobs" ADD CONSTRAINT "_profiles_jobs_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contributions_jobs" ADD CONSTRAINT "_contributions_jobs_A_fkey" FOREIGN KEY ("A") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contributions_jobs" ADD CONSTRAINT "_contributions_jobs_B_fkey" FOREIGN KEY ("B") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
