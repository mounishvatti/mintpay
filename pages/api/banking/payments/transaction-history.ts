import prisma from "@/prisma/PrismaClient";
import { NextApiRequest, NextApiResponse } from "next";

async function getTransactionHistory(upiid: string) {
    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { fromAccountId: upiid },
                { toAccountId: upiid },
            ],
        },
        orderBy: {
            created_at: "desc",
        },
    });
    console.log("Transactions found:", transactions);
    return transactions;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { upiid } = req.body;

        if (!upiid) {
            return res.status(400).json({ message: "UPI ID is required" });
        }

        const transactions = await getTransactionHistory(upiid);

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
