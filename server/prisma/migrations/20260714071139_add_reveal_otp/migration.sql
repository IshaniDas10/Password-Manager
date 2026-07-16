-- AlterTable
ALTER TABLE "User" ADD COLUMN     "revealOTP" TEXT,
ADD COLUMN     "revealOTPExpiresAt" TIMESTAMP(3);
