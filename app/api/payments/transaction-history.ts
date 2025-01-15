import prisma from "@/prisma/PrismaClient";

async function getTransactionHistory(upiid: string) {
    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { from_upi_id: upiid },
                { to_upi_id: upiid },
            ],
        },
        orderBy: {
            created_at: 'desc',
        },
    });
    console.log("Transactions found:", transactions);
    return transactions;
}