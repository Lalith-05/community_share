"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function MyItemsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/api/my-items")
      .then((res) => setItems(res.data));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        My Items
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded"
          >
            <h2 className="font-bold text-xl">
              {item.title}
            </h2>

            <p>{item.description}</p>

            <p className="text-sm text-gray-500">
              {item.category.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}