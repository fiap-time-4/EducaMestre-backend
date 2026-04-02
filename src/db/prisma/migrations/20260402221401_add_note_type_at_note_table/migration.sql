-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('REMINDER', 'NOTE');

-- AlterTable
ALTER TABLE "note" ADD COLUMN     "type" "NoteType" NOT NULL DEFAULT 'NOTE';
