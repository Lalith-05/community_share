import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
      <div className="flex gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/browse">Browse</Link>
        <Link href="/items">My Items</Link>
        <Link href="/my-requests">My Requests</Link>
        <Link href="/requests">Requests</Link>
        <Link href="/items/new">Add Item</Link>
      </div>
    </nav>
  );
}