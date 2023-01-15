-- AlterTable
ALTER TABLE "contributions" ADD COLUMN     "job_id" UUID;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
