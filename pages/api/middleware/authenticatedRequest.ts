import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export type JwtUserPayload = { userId: string };

export function getUserIdFromRequest(req: NextApiRequest): string | null {
  const token =
    req.cookies.token ??
    req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_USER_SECRET!,
    ) as JwtUserPayload;
    return decoded.userId ?? null;
  } catch {
    return null;
  }
}
