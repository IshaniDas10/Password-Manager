-- AlterTable
ALTER TABLE "Password" ADD COLUMN     "category" TEXT,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT;
