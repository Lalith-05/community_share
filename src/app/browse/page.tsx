"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/api/items")
      .then((res) => setItems(res.data));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Browse Items
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
          >
            <div className="border rounded p-4 hover:shadow cursor-pointer">
              <h2 className="text-xl font-bold">
                {item.title}
              </h2>

              <p className="mt-2">
                {item.description}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {item.category.name}
              </p>

              <p className="text-sm text-gray-500">
                Owner: {item.owner.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}