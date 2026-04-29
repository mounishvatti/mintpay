import { getUserIdFromRequest } from "@/pages/api/middleware/authenticatedRequest";
import { prisma } from "@/prisma/PrismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const bodySchema = z.object({
  from: z.string().min(1),
  amount: z.coerce.number().positive(),
});

/**
 * Mock “request money” — validates UPI exists and returns success (no ledger change).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { from, amount } = bodySchema.parse(req.body);

    const payer = await prisma.userBankDetails.findUnique({
      where: { upiid: from.trim() },
    });
    if (!payer) {
      return res.status(404).json({ message: "Sender UPI ID not found" });
    }

    return res.status(201).json({
      message: `Mock request recorded: ₹${amount} from ${from} (no funds moved).`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
