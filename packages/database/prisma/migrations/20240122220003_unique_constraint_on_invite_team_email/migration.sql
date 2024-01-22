/*
  Warnings:

  - A unique constraint covering the columns `[team_id,email]` on the table `team_invitations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "team_invitations_team_id_email_key" ON "team_invitations"("team_id", "email");
