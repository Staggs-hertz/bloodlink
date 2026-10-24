-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "DonorInvitation" (
    "id" TEXT NOT NULL,
    "bloodRequestId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "DonorInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "bloodRequestId" TEXT,
    "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unitsCollected" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DonorInvitation_bloodRequestId_donorId_idx" ON "DonorInvitation"("bloodRequestId", "donorId");

-- CreateIndex
CREATE INDEX "DonorInvitation_donorId_status_idx" ON "DonorInvitation"("donorId", "status");

-- CreateIndex
CREATE INDEX "DonorInvitation_bloodRequestId_status_idx" ON "DonorInvitation"("bloodRequestId", "status");

-- CreateIndex
CREATE INDEX "DonorInvitation_expiresAt_idx" ON "DonorInvitation"("expiresAt");

-- CreateIndex
CREATE INDEX "Donation_donorId_donationDate_idx" ON "Donation"("donorId", "donationDate");

-- CreateIndex
CREATE INDEX "Donation_bloodRequestId_idx" ON "Donation"("bloodRequestId");

-- CreateIndex
CREATE INDEX "Donation_donationDate_idx" ON "Donation"("donationDate");

-- AddForeignKey
ALTER TABLE "DonorInvitation" ADD CONSTRAINT "DonorInvitation_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorInvitation" ADD CONSTRAINT "DonorInvitation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
