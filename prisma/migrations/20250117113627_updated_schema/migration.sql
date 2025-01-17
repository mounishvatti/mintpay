/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `from_upi_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to_upi_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `userbankdetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fromAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_from_upi_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_to_upi_id_fkey";

-- DropForeignKey
ALTER TABLE "userbankdetails" DROP CONSTRAINT "userbankdetails_username_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "from_upi_id",
DROP COLUMN "to_upi_id",
ADD COLUMN     "fromAccountId" TEXT NOT NULL,
ADD COLUMN     "toAccountId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaction_id_seq";

-- DropTable
DROP TABLE "userbankdetails";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBankDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" VARCHAR(50) NOT NULL,
    "upiid" VARCHAR(255) NOT NULL,
    "pin" INTEGER NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserBankDetails_upiid_key" ON "UserBankDetails"("upiid");

-- AddForeignKey
ALTER TABLE "UserBankDetails" ADD CONSTRAINT "UserBankDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "UserBankDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "UserBankDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
