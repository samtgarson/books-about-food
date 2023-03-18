/*
  Warnings:

  - You are about to drop the `_profiles_jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "job_title" TEXT;
UPDATE profiles set job_title = j.name
from (
  select
    string_agg(jobs.name, ', ' order by jobs.name) as name,
    _profiles_jobs."B" as profile_id
  from _profiles_jobs
  inner join jobs on _profiles_jobs."A" = jobs.id
  group by _profiles_jobs."B"
) as j
where profiles.id = j.profile_id;

-- DropForeignKey
ALTER TABLE "_profiles_jobs" DROP CONSTRAINT "_profiles_jobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_profiles_jobs" DROP CONSTRAINT "_profiles_jobs_B_fkey";

-- DropTable
DROP TABLE "_profiles_jobs";
