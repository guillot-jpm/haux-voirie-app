-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifyOnStatusChange" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "rejectionReason" TEXT;
