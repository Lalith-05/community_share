"use client";

import Link from "next/link";
import axios from "axios";

export default function Navbar() {
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="flex gap-6 items-center">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/browse">
          Browse
        </Link>

        <Link href="/items">
          My Items
        </Link>

        <Link href="/my-requests">
          My Requests
        </Link>

        <Link href="/requests">
          Requests
        </Link>

        <Link href="/items/new">
          Add Item
        </Link>

        <button
          onClick={handleLogout}
          className="ml-auto bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}