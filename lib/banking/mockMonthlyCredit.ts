import { prisma } from "@/prisma/PrismaClient";
import { MockMonthlyCreditStateKey, Prisma } from "@prisma/client";
import { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

export { MOCK_MONTHLY_SALARY_INR } from "@/lib/banking/constants";

const STATE_ROW_ID: MockMonthlyCreditStateKey = "ONLY";
const MAX_RETRIES = 3;

export function currentSalaryMonthKeyUtc(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Ensures all `UserBankDetails` rows receive {@link MOCK_MONTHLY_SALARY_INR}
 * for the current UTC month exactly once (global checkpoint).
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
          const state = await tx.mockMonthlyCreditState.findUnique({
            where: { id: STATE_ROW_ID },
          });
          if (state?.lastCreditedMonth === monthKey) return;

          await tx.userBankDetails.updateMany({
            data: {
              balance: { increment: MOCK_MONTHLY_SALARY_INR },
            },
          });

          await tx.mockMonthlyCreditState.upsert({
            where: { id: STATE_ROW_ID },
            create: { id: STATE_ROW_ID, lastCreditedMonth: monthKey },
            update: { lastCreditedMonth: monthKey },
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
