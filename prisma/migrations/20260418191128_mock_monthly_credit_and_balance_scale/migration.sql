-- AlterTable
ALTER TABLE "UserBankDetails" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(12,2);

-- CreateTable
CREATE TABLE "MockMonthlyCreditState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastCreditedMonth" VARCHAR(7),

    CONSTRAINT "MockMonthlyCreditState_pkey" PRIMARY KEY ("id")
);
