"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios
      .get(`/api/items?search=${search}&category=${category}`)
      .then((res) => setItems(res.data));
  }, [search, category]);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Browse Items
      </h1>
          <input
  type="text"
  placeholder="Search items..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="w-full border p-3 rounded mb-6"
/>

<select
  value={category}
  onChange={(e) =>
    setCategory(e.target.value)
  }
  className="w-full border p-3 rounded mb-6"
>
  <option value="">
    All Categories
  </option>

  <option value="Tools">
    Tools
  </option>

  <option value="Electronics">
    Electronics
  </option>

  <option value="Sports">
    Sports
  </option>

  <option value="Books">
    Books
  </option>

  <option value="Kitchen">
    Kitchen
  </option>

  <option value="Gaming">
    Gaming
  </option>

  <option value="Other">
    Other
  </option>
</select>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
          >
            <div className="border rounded p-4 hover:shadow cursor-pointer">
              {item.imageUrls?.[0] && (
                <img
                  src={item.imageUrls[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
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
              <p
  className={`mt-2 font-semibold ${
    item.availability
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {item.availability
    ? "🟢 Available"
    : "🔴 Unavailable"}
</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}