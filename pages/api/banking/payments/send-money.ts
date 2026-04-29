import { prisma}  from "@/prisma/PrismaClient";
import { Decimal } from "decimal.js";
import { getUserIdFromRequest } from "@/pages/api/middleware/authenticatedRequest";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";

const bodySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.coerce.number().positive(),
  pin: z.coerce.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

type SendMoneyErrorCode =
  | "SENDER_NOT_FOUND"
  | "NOT_OWNER"
  | "INCORRECT_PIN"
  | "RECEIVER_NOT_FOUND"
  | "SAME_ACCOUNT"
  | "INSUFFICIENT_BALANCE";

class SendMoneyError extends Error {
  constructor(
    public readonly code: SendMoneyErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SendMoneyError";
  }
}

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
      throw new SendMoneyError("SENDER_NOT_FOUND", "Sender account does not exist.");
    }
    if (sender.userId !== userId) {
      throw new SendMoneyError("NOT_OWNER", "You can only send from your own UPI ID.");
    }

    const pinOk = await bcrypt.compare(pin, sender.pin);
    if (!pinOk) {
      throw new SendMoneyError("INCORRECT_PIN", "Incorrect PIN.");
    }

    const receiver = await tx.userBankDetails.findUnique({
      where: { upiid: toUpi },
    });

    if (!receiver) {
      throw new SendMoneyError("RECEIVER_NOT_FOUND", "Receiver account does not exist.");
    }
    if (receiver.id === sender.id) {
      throw new SendMoneyError("SAME_ACCOUNT", "Cannot send to the same account.");
    }

    const amountDecimal = new Decimal(amount);

    const debitResult = await tx.userBankDetails.updateMany({
      where: {
        id: sender.id,
        balance: { gte: amountDecimal },
      },
      data: {
        balance: { decrement: amountDecimal },
      },
    });

    if (debitResult.count !== 1) {
      throw new SendMoneyError("INSUFFICIENT_BALANCE", "Insufficient balance.");
    }

    await tx.userBankDetails.update({
      where: { id: receiver.id },
      data: {
        balance: { increment: amountDecimal },
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

const STATUS_FOR_CODE: Record<SendMoneyErrorCode, number> = {
  SENDER_NOT_FOUND: 404,
  RECEIVER_NOT_FOUND: 404,
  NOT_OWNER: 403,
  INCORRECT_PIN: 401,
  SAME_ACCOUNT: 403,
  INSUFFICIENT_BALANCE: 400,
};

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
    if (err instanceof SendMoneyError) {
      return res.status(STATUS_FOR_CODE[err.code]).json({ message: err.message });
    }
    console.error("Error sending money:", err);
    return res.status(500).json({ message: "Transaction failed" });
  }
}
