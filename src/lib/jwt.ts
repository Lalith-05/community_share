import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export function generateToken(payload: {
  id: string;
  email: string;
}) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(
  token: string
): AuthTokenPayload | null {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // A valid token can decode to a string.
    // Our application requires an object payload.
    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string"
    ) {
      return null;
    }

    return decoded as AuthTokenPayload;
  } catch {
    return null;
  }
}