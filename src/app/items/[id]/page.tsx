"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function ItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [message, setMessage] = useState("");

const handleBorrow = async () => {
  try {
    await axios.post(
      "/api/borrow-requests",
      {
        itemId: item.id,
        startDate,
        endDate,
        message,
      }
    );

    alert("Borrow request sent!");

  } catch (error: any) {

    console.error(error);

    alert(
      error.response?.data?.error ||
      "Failed to send request"
    );
  }
};
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
      <p
  className={`mt-2 font-bold ${
    item.availability
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {item.availability
    ? "🟢 Available"
    : "🔴 Unavailable"}
</p>
      {item.availability && (
  <div className="mt-8 border-t pt-6">
      <div className="mt-8 border-t pt-6">
  <h2 className="text-2xl font-bold mb-4">
    Request Borrow
  </h2>

  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="w-full border p-3 rounded mb-3"
  />

  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="w-full border p-3 rounded mb-3"
  />

  <textarea
    placeholder="Message to owner"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="w-full border p-3 rounded mb-3"
  />

  <button
    onClick={handleBorrow}
    className="bg-black text-white px-4 py-2 rounded"
  >
    Send Request
  </button>
</div>
</div>)}
</main>
  );
}