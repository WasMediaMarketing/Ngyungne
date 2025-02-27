import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_default_secret"; // Ensure it's in your .env

export async function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

    if (!decoded || (decoded.exp && Date.now() >= decoded.exp * 1000)) {
      throw new Error("Unauthorized: Token expired");
    }

    return decoded;
  } catch {
    throw new Error("Unauthorized: Invalid token");
  }
}
