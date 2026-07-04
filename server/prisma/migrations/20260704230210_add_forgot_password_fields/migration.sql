-- AlterTable
ALTER TABLE "User" ADD COLUMN     "forgotPasswordExpiresAt" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordOTP" TEXT;
