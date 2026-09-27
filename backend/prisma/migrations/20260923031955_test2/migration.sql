/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `BloodRequest` table. All the data in the column will be lost.
  - You are about to drop the column `donorId` on the `BloodRequest` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `BloodRequest` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `BloodRequest` table. All the data in the column will be lost.
  - You are about to drop the `Donor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bloodType` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalName` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitsNeeded` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('NORMAL', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'MATCHED', 'APPROVED', 'FULFILLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('SENT', 'READ');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'RECIPIENT';
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- DropForeignKey
ALTER TABLE "BloodRequest" DROP CONSTRAINT "BloodRequest_donorId_fkey";

-- DropForeignKey
ALTER TABLE "Donor" DROP CONSTRAINT "Donor_userId_fkey";

-- AlterTable
ALTER TABLE "BloodRequest" DROP COLUMN "bloodGroup",
DROP COLUMN "donorId",
DROP COLUMN "location",
DROP COLUMN "message",
ADD COLUMN     "bloodType" "BloodType" NOT NULL,
ADD COLUMN     "hospitalName" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "unitsNeeded" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "urgency" "Urgency" NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerifiedInstitution" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "organizationName" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Donor";

-- DropEnum
DROP TYPE "BloodGroup";

-- CreateTable
CREATE TABLE "DonorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodType" "BloodType",
    "gender" "Gender",
    "dateOfBirth" TIMESTAMP(3),
    "phone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Nigeria',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "smsOptIn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DonorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodInventory" (
    "id" TEXT NOT NULL,
    "bloodType" "BloodType" NOT NULL,
    "unitsAvailable" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonorProfile_userId_key" ON "DonorProfile"("userId");

-- CreateIndex
CREATE INDEX "DonorProfile_userId_idx" ON "DonorProfile"("userId");

-- CreateIndex
CREATE INDEX "DonorProfile_bloodType_idx" ON "DonorProfile"("bloodType");

-- CreateIndex
CREATE INDEX "DonorProfile_isAvailable_idx" ON "DonorProfile"("isAvailable");

-- CreateIndex
CREATE INDEX "DonorProfile_bloodType_isAvailable_idx" ON "DonorProfile"("bloodType", "isAvailable");

-- CreateIndex
CREATE INDEX "DonorProfile_gender_idx" ON "DonorProfile"("gender");

-- CreateIndex
CREATE INDEX "DonorProfile_city_idx" ON "DonorProfile"("city");

-- CreateIndex
CREATE INDEX "DonorProfile_state_idx" ON "DonorProfile"("state");

-- CreateIndex
CREATE INDEX "DonorProfile_country_idx" ON "DonorProfile"("country");

-- CreateIndex
CREATE UNIQUE INDEX "BloodInventory_bloodType_key" ON "BloodInventory"("bloodType");

-- CreateIndex
CREATE INDEX "BloodInventory_bloodType_idx" ON "BloodInventory"("bloodType");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "RefreshToken_isRevoked_idx" ON "RefreshToken"("isRevoked");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_isRevoked_idx" ON "RefreshToken"("userId", "isRevoked");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_status_idx" ON "Notification"("userId", "status");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_token_idx" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_isUsed_idx" ON "EmailVerificationToken"("isUsed");

-- CreateIndex
CREATE INDEX "BloodRequest_recipientId_idx" ON "BloodRequest"("recipientId");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodType_idx" ON "BloodRequest"("bloodType");

-- CreateIndex
CREATE INDEX "BloodRequest_status_idx" ON "BloodRequest"("status");

-- CreateIndex
CREATE INDEX "BloodRequest_urgency_idx" ON "BloodRequest"("urgency");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodType_status_idx" ON "BloodRequest"("bloodType", "status");

-- CreateIndex
CREATE INDEX "BloodRequest_recipientId_status_idx" ON "BloodRequest"("recipientId", "status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_isEmailVerified_idx" ON "User"("isEmailVerified");

-- AddForeignKey
ALTER TABLE "DonorProfile" ADD CONSTRAINT "DonorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
