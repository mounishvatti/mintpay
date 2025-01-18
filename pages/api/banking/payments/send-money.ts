import prisma from "@/prisma/PrismaClient";
import { Decimal } from "@prisma/client/runtime/library";

async function sendMoney(from: string, to: string, amount: number) {
    //@ts-ignore
    const result = await prisma.$transaction(async (prisma) => {
        // Check sender's balance
        const sender = await prisma.userBankDetails.findUnique({
            where: { upiid: from },
        });

        if (!sender) {
            throw new Error("Sender account does not exist.");
        }

        const senderBalance = sender.balance ?? 0;

        if (Number(senderBalance) < amount) {
            throw new Error("Insufficient balance.");
        }

        // Check receiver's balance
        const receiver = await prisma.userBankDetails.findUnique({
            where: { upiid: to },
        });

        if (!receiver) {
            throw new Error("Receiver account does not exist.");
        }

        const receiverBalance = receiver.balance ?? 0;

        // Update sender's balance
        const debited = await prisma.userBankDetails.update({
            where: { upiid: from },
            data: {
                balance: new Decimal(senderBalance).minus(new Decimal(amount)),
            },
        });
        console.log(`${from} account debited ${amount} with ${debited.balance} balance.`);
        // Update receiver's balance
        const credited = await prisma.userBankDetails.update({
            where: { upiid: to },
            data: {
                balance: new Decimal(receiverBalance).plus(new Decimal(amount)),
            },
        });
        console.log(`${to} account credited with ${amount} from ${from}.`);
        // Create the transaction history record
        await prisma.transaction.create({
            data: {
                fromAccountId: from,
                toAccountId: to,
                amount: amount,
            },
        });
    });
}

//@ts-ignore
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
    
    const { from, to, amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ error: "Invalid transaction amount." });
    }

    try {
        await sendMoney(from, to, amount);

        res.status(200).json({ message: `${to} account successfully credited with amount: ${amount}. Transaction successful.` });
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error sending money:", err.message);
        }
    }
}