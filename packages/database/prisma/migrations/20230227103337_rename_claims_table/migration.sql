/*
  Warnings:

*/
-- CreateTable
CREATE TABLE "claims" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_id" UUID,
    "publisher_id" UUID,
    "secret" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "approved_at" DATE,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "claims_user_id_profile_id_key" ON "claims"("user_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "claims_user_id_publisher_id_key" ON "claims"("user_id", "publisher_id");

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
