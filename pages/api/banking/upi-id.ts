import { prisma } from "@/prisma/PrismaClient";
import { getUserIdFromRequest } from "@/pages/api/proxy/authenticatedRequest";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const bodySchema = z.object({
  upiid: z
    .string()
    .min(3)
    .max(255)
    .transform((s) => s.trim().toLowerCase()),
});

const upiPattern = /^[\w.-]+@[\w.-]+$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { upiid } = bodySchema.parse(req.body);

    if (!upiPattern.test(upiid)) {
      return res.status(400).json({
        message:
          "UPI ID should look like yourname@bank (letters, numbers, dot, hyphen).",
      });
    }

    const account = await prisma.userBankDetails.findFirst({
      where: { userId },
    });

    if (!account) {
      return res.status(404).json({ message: "No bank account for this user" });
    }

    if (account.upiid === upiid) {
      return res.status(200).json({
        message: "UPI ID unchanged",
        bankAccount: { ...account, pin: undefined },
      });
    }

    const taken = await prisma.userBankDetails.findUnique({
      where: { upiid },
    });
    if (taken) {
      return res.status(409).json({ message: "This UPI ID is already taken" });
    }

    const updated = await prisma.userBankDetails.update({
      where: { id: account.id },
      data: { upiid },
    });

    return res.status(200).json({
      message: "UPI ID updated",
      bankAccount: { ...updated, pin: undefined },
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
