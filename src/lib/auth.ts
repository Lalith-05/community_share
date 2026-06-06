import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  const payload = verifyToken(token.value);

  return payload;
}