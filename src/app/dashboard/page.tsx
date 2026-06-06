import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-4">
        Welcome to NeighbourShare
      </p>
    </main>
  );
}