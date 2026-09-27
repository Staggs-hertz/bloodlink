-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "matchedDonorId" TEXT;

-- CreateIndex
CREATE INDEX "BloodRequest_matchedDonorId_idx" ON "BloodRequest"("matchedDonorId");

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_matchedDonorId_fkey" FOREIGN KEY ("matchedDonorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
