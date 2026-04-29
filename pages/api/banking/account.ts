import { prisma } from "@/prisma/PrismaClient";
import { ensureMockMonthlyCreditsApplied } from "@/lib/banking/mockMonthlyCredit";
import { getUserIdFromRequest } from "@/pages/api/middleware/authenticatedRequest";
import { NextApiRequest, NextApiResponse } from "next";

function stripPin<T extends { pin?: string }>(row: T) {
  const { pin: _p, ...rest } = row;
  return rest;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await ensureMockMonthlyCreditsApplied();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { bankdetails: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
      },
      bankdetails: user.bankdetails.map(stripPin),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
