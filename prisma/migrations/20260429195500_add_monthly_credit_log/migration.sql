-- CreateTable
CREATE TABLE "MonthlyCreditLog" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "monthKey" VARCHAR(7) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "creditedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyCreditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlyCreditLog_monthKey_idx" ON "MonthlyCreditLog"("monthKey");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyCreditLog_accountId_monthKey_key" ON "MonthlyCreditLog"("accountId", "monthKey");

-- AddForeignKey
ALTER TABLE "MonthlyCreditLog" ADD CONSTRAINT "MonthlyCreditLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UserBankDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
