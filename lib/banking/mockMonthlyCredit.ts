import prisma from "@/prisma/PrismaClient";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

export { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

const STATE_ROW_ID = 1;

export function currentSalaryMonthKeyUtc(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Ensures all `UserBankDetails` rows receive {@link MOCK_MONTHLY_SALARY_INR}
 * for the current UTC month exactly once (global checkpoint).
 */
export async function ensureMockMonthlyCreditsApplied(): Promise<void> {
  const monthKey = currentSalaryMonthKeyUtc();

  await prisma.$transaction(
    async (tx) => {
      const state = await tx.mockMonthlyCreditState.findUnique({
        where: { id: STATE_ROW_ID },
      });
      if (state?.lastCreditedMonth === monthKey) return;

      const accounts = await tx.userBankDetails.findMany({
        select: { id: true, balance: true },
      });

      for (const acc of accounts) {
        await tx.userBankDetails.update({
          where: { id: acc.id },
          data: {
            balance: new Decimal(acc.balance).plus(MOCK_MONTHLY_SALARY_INR),
          },
        });
      }

      await tx.mockMonthlyCreditState.upsert({
        where: { id: STATE_ROW_ID },
        create: { id: STATE_ROW_ID, lastCreditedMonth: monthKey },
        update: { lastCreditedMonth: monthKey },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
