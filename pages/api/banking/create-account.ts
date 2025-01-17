import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/PrismaClient";
import { z } from "zod";

const createAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  pin: z.number().min(1, "Pin is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Parse the request body
}