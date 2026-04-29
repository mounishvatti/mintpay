import { prisma } from "@/prisma/PrismaClient";
import { Prisma } from "@/generated/prisma/client";
import { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

export { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

const MAX_RETRIES = 3;

export function currentSalaryMonthKeyUtc(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Ensures all `UserBankDetails` rows receive {@link MOCK_MONTHLY_SALARY_INR}
 * for the current UTC month exactly once per account.
 *
 * Uses a single `updateMany` increment so the credit is applied in one SQL
 * statement. Retries up to {@link MAX_RETRIES} times on SERIALIZABLE
 * transaction conflicts (Prisma error P2034) to prevent intermittent 500s
 * when multiple users load the dashboard at the same time near month rollover.
 */
export async function ensureMockMonthlyCreditsApplied(): Promise<void> {
  const monthKey = currentSalaryMonthKeyUtc();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await prisma.$transaction(
        async (tx) => {
          const accounts = await tx.userBankDetails.findMany({
            select: { id: true },
          });
          if (accounts.length === 0) return;

          const creditedThisMonth = await tx.monthlyCreditLog.findMany({
            where: { monthKey },
            select: { accountId: true },
          });

          const creditedIds = new Set(creditedThisMonth.map((row) => row.accountId));
          const targetAccountIds = accounts
            .map((account) => account.id)
            .filter((id) => !creditedIds.has(id));

          if (targetAccountIds.length === 0) return;

          await tx.userBankDetails.updateMany({
            where: {
              id: { in: targetAccountIds },
            },
            data: {
              balance: { increment: MOCK_MONTHLY_SALARY_INR },
            },
          });

          await tx.monthlyCreditLog.createMany({
            data: targetAccountIds.map((accountId) => ({
              accountId,
              monthKey,
              amount: MOCK_MONTHLY_SALARY_INR,
            })),
            skipDuplicates: true,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return;
    } catch (err) {
      const isConflict =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2034";
      if (!isConflict || attempt === MAX_RETRIES - 1) {
        throw err;
      }
      // Linear back-off: 50 ms, 100 ms, 150 ms
      await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
    }
  }
}
