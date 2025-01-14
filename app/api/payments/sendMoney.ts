import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import express from "express";

const PORT = process.env.PORT || 4000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello World");
});

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

async function sendMoney(from: string, to: string, amount: number) {
    const result = await prisma.$transaction(async (prisma) => {
        // Check sender's balance
        const sender = await prisma.userbankdetails.findUnique({
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
        const receiver = await prisma.userbankdetails.findUnique({
            where: { upiid: to },
        });

        if (!receiver) {
            throw new Error("Receiver account does not exist.");
        }

        const receiverBalance = receiver.balance ?? 0;

        // Update sender's balance
        const debited = await prisma.userbankdetails.update({
            where: { upiid: from },
            data: {
                balance: new Decimal(senderBalance).minus(new Decimal(amount)),
            },
        });
        console.log(`${from} account debited ${amount} with ${debited.balance} balance.`);
        // Update receiver's balance
        const credited = await prisma.userbankdetails.update({
            where: { upiid: to },
            data: {
                balance: new Decimal(receiverBalance).plus(new Decimal(amount)),
            },
        });
        console.log(`${to} account credited with ${amount} from ${from}.`);
        // Create the transaction history record
        await prisma.transaction.create({
            data: {
                from_upi_id: from,
                to_upi_id: to,
                amount: amount,
            },
        });
    });
}

async function createUserBankDetails(
    username: string,
    email: string,
    upiid: string,
    balance: number,
    pin: number,
) {
    const userBankDetails = await prisma.userbankdetails.create({
        data: {
            username,
            email,
            upiid,
            balance,
            pin,
        },
    });

    return userBankDetails;
}

async function createUser(username: string, email: string, password: string) {
    const user = await prisma.users.create({
        data: {
            username,
            email,
            password,
        },
    });

    return user;
}

async function getUser(username: string) {
    const user = await prisma.users.findUnique({
        where: {
            username,
        },
    });

    return user;
}

async function getUsers() {
    const users = await prisma.users.findMany();

    return users;
}

async function getUserBankBalance(upiid: string) {
    const userBankDetails = await prisma.userbankdetails.findUnique({
        where: {
            upiid,
        },
    });

    return userBankDetails?.balance;
}

app.post("/create-user", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Create user and wait for the operation to complete
        createUser(username, email, password);

        // Send a successful response once the user is created
        res.status(201).json({
            message: "User created successfully",
        });
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error creating user:", err.message);
        } else {
            console.error("Error creating user:", err);
        }
        res.status(500).json({
            error: "An error occurred while creating the user.",
        });
    }
});

//@ts-ignore
app.post("/send-money", async (req, res) => {
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
});

app.post("/create-bank-account", async (req, res) => {
    const { username, email, upiid, balance, pin } = req.body;
    try {
        const userBankDetails = await createUserBankDetails(
            username,
            email,
            upiid,
            balance,
            pin,
        );
        res.status(201).json(userBankDetails);
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error creating user bank details:", err.message);
        } else {
            console.error("Error creating user bank details:", err);
        }
        res.status(500).json({
            error: "An error occurred while creating the user bank details.",
        });
    }
});

//@ts-ignore
app.get("/get-transaction-history", async (req, res) => {
    const { upiid } = req.query;

    if (typeof upiid !== 'string') {
        return res.status(400).json({ error: "Invalid UPI ID." });
    }

    try {
        const transactions = await getTransactionHistory(upiid);
        res.status(200).json(transactions);
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error getting transaction history:", err.message);
        } else {
            console.error("Error getting transaction history:", err);
        }
        res.status(500).json({
            error: "An error occurred while getting the transaction history.",
        });
    }
});

//@ts-ignore
app.get("/get-user-balance", async (req, res) => {
    const { upiid } = req.query;

    if (typeof upiid !== 'string') {
        return res.status(400).json({ error: "Invalid UPI ID." });
    }

    try {
        const userBankDetails = await getUserBankBalance(upiid);
        res.status(200).json(`$${userBankDetails}, user bank balance fetched successfully.`);
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error getting user balance:", err.message);
        } else {
            console.error("Error getting user balance:", err);
        }
        res.status(500).json({
            error: "An error occurred while getting the user balance.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});