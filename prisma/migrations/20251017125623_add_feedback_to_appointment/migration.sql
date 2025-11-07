/*
  Warnings:

  - You are about to drop the column `feedbackDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `patientFeedback` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "feedbackDate" TIMESTAMP(3),
ADD COLUMN     "patientFeedback" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "feedbackDate",
DROP COLUMN "patientFeedback";
