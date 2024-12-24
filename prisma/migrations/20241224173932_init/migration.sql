/*
  Warnings:

  - You are about to drop the column `isReporter` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isReporter",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';
