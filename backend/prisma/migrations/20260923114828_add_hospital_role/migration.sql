/*
  Warnings:

  - The values [RECIPIENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `recipientId` on the `BloodRequest` table. All the data in the column will be lost.
  - Added the required column `hospitalId` to the `BloodRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('DONOR', 'HOSPITAL', 'ADMIN', 'SUPER_ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DONOR';
COMMIT;

-- DropForeignKey
ALTER TABLE "BloodRequest" DROP CONSTRAINT "BloodRequest_recipientId_fkey";

-- DropIndex
DROP INDEX "BloodRequest_recipientId_idx";

-- DropIndex
DROP INDEX "BloodRequest_recipientId_status_idx";

-- AlterTable
ALTER TABLE "BloodRequest" DROP COLUMN "recipientId",
ADD COLUMN     "hospitalId" TEXT NOT NULL,
ADD COLUMN     "hospitalNo" TEXT,
ADD COLUMN     "patientAge" INTEGER,
ADD COLUMN     "patientGender" "Gender",
ADD COLUMN     "patientName" TEXT,
ADD COLUMN     "ward" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Nigeria',
ADD COLUMN     "state" TEXT;

-- CreateIndex
CREATE INDEX "BloodRequest_hospitalId_idx" ON "BloodRequest"("hospitalId");

-- CreateIndex
CREATE INDEX "BloodRequest_hospitalId_status_idx" ON "BloodRequest"("hospitalId", "status");

-- CreateIndex
CREATE INDEX "User_isVerifiedInstitution_idx" ON "User"("isVerifiedInstitution");

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
