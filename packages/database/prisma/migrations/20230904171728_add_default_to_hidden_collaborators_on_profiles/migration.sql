-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "hidden_collaborators" SET DEFAULT ARRAY[]::TEXT[];

UPDATE profiles SET hidden_collaborators = '{}' WHERE hidden_collaborators IS NULL;
