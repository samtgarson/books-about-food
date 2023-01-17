/*
  Warnings:

  - Made the column `job_id` on table `contributions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "contributions" DROP CONSTRAINT "contributions_job_id_fkey";

-- AlterTable
ALTER TABLE "contributions" ALTER COLUMN "job_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
