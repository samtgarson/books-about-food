-- DropForeignKey
ALTER TABLE "contributions" DROP CONSTRAINT "contributions_job_id_fkey";

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "_ContributionToJob" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContributionToJob_AB_unique" ON "_ContributionToJob"("A", "B");

-- CreateIndex
CREATE INDEX "_ContributionToJob_B_index" ON "_ContributionToJob"("B");

-- AddForeignKey
ALTER TABLE "_ContributionToJob" ADD CONSTRAINT "_ContributionToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributionToJob" ADD CONSTRAINT "_ContributionToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
