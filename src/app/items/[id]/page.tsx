"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/items/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (!item) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        {item.title}
      </h1>

      <p className="mt-4">
        {item.description}
      </p>

      <p className="mt-4">
        Category: {item.category.name}
      </p>

      <p className="mt-2">
        Owner: {item.owner.name}
      </p>

      <p className="mt-2">
        Max Borrow Days: {item.maxBorrowDays}
      </p>
      <button
  onClick={handleBorrow}
  className="mt-6 bg-black text-white px-4 py-2 rounded"
>
  Request Borrow
</button>
    </main>
  );
}