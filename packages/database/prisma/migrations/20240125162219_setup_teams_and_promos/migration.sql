-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('admin', 'member');

-- AlterTable
ALTER TABLE "claims" ALTER COLUMN "approved_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "publishers" ADD COLUMN     "hidden_books" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "team_id" UUID;

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "MembershipRole" NOT NULL DEFAULT 'member',
    "team_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "team_id" UUID NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "invited_by_id" UUID NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'member',

    CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "until" DATE,
    "publisher_id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "promos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "book_id" UUID NOT NULL,
    "promo_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "promo_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_slug_key" ON "teams"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_team_id_user_id_key" ON "memberships"("team_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_invitations_team_id_email_key" ON "team_invitations"("team_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "promo_items_promo_id_book_id_key" ON "promo_items"("promo_id", "book_id");

-- AddForeignKey
ALTER TABLE "publishers" ADD CONSTRAINT "publishers_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promos" ADD CONSTRAINT "promos_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_items" ADD CONSTRAINT "promo_items_promo_id_fkey" FOREIGN KEY ("promo_id") REFERENCES "promos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_items" ADD CONSTRAINT "promo_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
