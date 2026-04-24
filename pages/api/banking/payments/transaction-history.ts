import prisma from "@/prisma/PrismaClient";
import { getUserIdFromRequest } from "@/pages/api/middleware/authenticatedRequest";
import { NextApiRequest, NextApiResponse } from "next";

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
    const { upiid } = req.body;

    if (!upiid || typeof upiid !== "string") {
      return res.status(400).json({ message: "UPI ID is required" });
    }

    const normalizedUpiId = upiid.trim().toLowerCase();

    const account = await prisma.userBankDetails.findUnique({
      where: { upiid: normalizedUpiId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: account.id },
          { toAccountId: account.id },
        ],
      },
      orderBy: { created_at: "desc" },
      include: {
        fromAccount: { select: { upiid: true } },
        toAccount: { select: { upiid: true } },
      },
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
