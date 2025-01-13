/*
  Warnings:

  - Added the required column `pin` to the `userbankdetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userbankdetails" ADD COLUMN     "pin" INTEGER NOT NULL;
