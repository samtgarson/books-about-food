/*
  Warnings:

  - You are about to drop the column `team_id` on the `memberships` table. All the data in the column will be lost.
  - You are about to drop the `team_invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[publisher_id,user_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publisher_id` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_team_id_fkey";

-- DropForeignKey
ALTER TABLE "publishers" DROP CONSTRAINT "publishers_team_id_fkey";

-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_invited_by_id_fkey";

-- DropForeignKey
ALTER TABLE "team_invitations" DROP CONSTRAINT "team_invitations_team_id_fkey";

-- DropIndex
DROP INDEX "memberships_team_id_user_id_key";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "team_id",
ADD COLUMN     "publisher_id" UUID NOT NULL;

-- DropTable
DROP TABLE "team_invitations";

-- DropTable
DROP TABLE "teams";

-- CreateTable
CREATE TABLE "publisher_invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "publisher_id" UUID NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "invited_by_id" UUID NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'member',

    CONSTRAINT "publisher_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "publisher_invitations_publisher_id_email_key" ON "publisher_invitations"("publisher_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_publisher_id_user_id_key" ON "memberships"("publisher_id", "user_id");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_invitations" ADD CONSTRAINT "publisher_invitations_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_invitations" ADD CONSTRAINT "publisher_invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
