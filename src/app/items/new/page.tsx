"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function NewItemPage() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [maxBorrowDays, setMaxBorrowDays] =
    useState("");

  const [depositAmount, setDepositAmount] =
    useState("");

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) =>
        setCategories(res.data)
      );
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await axios.post("/api/items", {
      title,
      description,
      categoryId,
      maxBorrowDays,
      depositAmount,
    });

    alert("Item created!");
  };

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Add Item
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          className="w-full border p-3 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="w-full border p-3 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <select
          className="w-full border p-3 rounded"
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="w-full border p-3 rounded"
          placeholder="Max Borrow Days"
          value={maxBorrowDays}
          onChange={(e) =>
            setMaxBorrowDays(e.target.value)
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded"
          placeholder="Deposit Amount (Optional)"
          value={depositAmount}
          onChange={(e) =>
            setDepositAmount(e.target.value)
          }
        />

        <button
          className="w-full bg-black text-white p-3 rounded"
        >
          Create Item
        </button>
      </form>
    </main>
  );
}