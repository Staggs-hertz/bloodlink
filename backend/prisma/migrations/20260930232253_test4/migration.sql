/*
  Warnings:

  - You are about to drop the column `hospitalNo` on the `BloodRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BloodRequest" DROP COLUMN "hospitalNo",
ADD COLUMN     "patientReferenceNo" TEXT;
