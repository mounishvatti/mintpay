import prisma from "@/prisma/PrismaClient";
import { Decimal } from "@prisma/client/runtime/library";
import { getUserIdFromRequest } from "@/pages/api/middleware/authenticatedRequest";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";

const bodySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.coerce.number().positive(),
  pin: z.coerce.string().min(4).max(10),
});

async function sendMoney(
  userId: string,
  fromUpi: string,
  toUpi: string,
  amount: number,
  pin: string,
) {
  await prisma.$transaction(async (tx) => {
    const sender = await tx.userBankDetails.findUnique({
      where: { upiid: fromUpi },
    });

    if (!sender) {
      throw new Error("Sender account does not exist.");
    }
    if (sender.userId !== userId) {
      throw new Error("You can only send from your own UPI ID.");
    }

    const pinOk = await bcrypt.compare(pin, sender.pin);
    if (!pinOk) {
      throw new Error("Incorrect PIN.");
    }

    const receiver = await tx.userBankDetails.findUnique({
      where: { upiid: toUpi },
    });

    if (!receiver) {
      throw new Error("Receiver account does not exist.");
    }
    if (receiver.id === sender.id) {
      throw new Error("Cannot send to the same account.");
    }

    const senderBalance = sender.balance ?? 0;
    if (new Decimal(senderBalance).lessThan(amount)) {
      throw new Error("Insufficient balance.");
    }

    const receiverBalance = receiver.balance ?? 0;

    await tx.userBankDetails.update({
      where: { id: sender.id },
      data: {
        balance: new Decimal(senderBalance).minus(new Decimal(amount)),
      },
    });

    await tx.userBankDetails.update({
      where: { id: receiver.id },
      data: {
        balance: new Decimal(receiverBalance).plus(new Decimal(amount)),
      },
    });

    await tx.transaction.create({
      data: {
        fromAccountId: sender.id,
        toAccountId: receiver.id,
        amount,
      },
    });
  });
}

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
    const parsed = bodySchema.parse(req.body);
    const from = parsed.from.trim().toLowerCase();
    const to = parsed.to.trim().toLowerCase();

    await sendMoney(userId, from, to, parsed.amount, parsed.pin);

    return res.status(201).json({
      message: `Sent ${parsed.amount} INR from ${from} to ${to}.`,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
    if (err instanceof Error) {
      const msg = err.message;
      if (
        msg.includes("PIN") ||
        msg.includes("only send") ||
        msg.includes("same account")
      ) {
        return res.status(403).json({ message: msg });
      }
      if (msg.includes("not exist")) {
        return res.status(404).json({ message: msg });
      }
      if (msg.includes("Insufficient")) {
        return res.status(400).json({ message: msg });
      }
      console.error("Error sending money:", msg);
    }
    return res.status(500).json({ message: "Transaction failed" });
  }
}
