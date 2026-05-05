import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends NextApiRequest {
  user?: any; // Replace 'any' with the actual type of your decoded JWT payload
}

// Custom middleware to verify JWT token
export async function verifyJWT(req: AuthenticatedRequest, res: NextApiResponse, next: Function) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Get token from cookies or authorization header
  
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET!); // Ensure that JWT_USER_SECRET is set in your environment variables
    req.user = decoded; // Add the decoded token data (e.g., userId) to the request object
    
    return next(); // Proceed to the next handler
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}