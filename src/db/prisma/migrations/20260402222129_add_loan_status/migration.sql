-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE');

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE';
