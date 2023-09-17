/*
  Warnings:

  - You are about to drop the column `publisher_id` on the `claims` table. All the data in the column will be lost.
  - Made the column `profile_id` on table `claims` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "claims_user_id_publisher_id_key";

-- AlterTable
ALTER TABLE "claims" DROP COLUMN "publisher_id",
ALTER COLUMN "profile_id" SET NOT NULL;
