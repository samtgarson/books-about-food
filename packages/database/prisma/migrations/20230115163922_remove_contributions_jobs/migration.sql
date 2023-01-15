/*
  Warnings:

  - You are about to drop the `_contributions_jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_contributions_jobs" DROP CONSTRAINT "_contributions_jobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_contributions_jobs" DROP CONSTRAINT "_contributions_jobs_B_fkey";

-- DropTable
DROP TABLE "_contributions_jobs";
