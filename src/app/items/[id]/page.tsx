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
const [reviews,
setReviews] =
useState<any[]>([]);

const [rating,
setRating] =
useState(5);

const [comment,
setComment] =
useState("");

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

const handleReview =
async () => {

  await axios.post(
    "/api/reviews",

    {

      itemId:
        item.id,

      rating,

      comment,

    }
  );

  alert(
    "Review added!"
  );

  setComment("");
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

        axios.get(`/api/reviews?itemId=${id}`)
      .then((res) => setReviews(res.data));  
      
  }, [id]);

  if (!item) {
    return <div className="p-10">Loading...</div>;
  }


  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        {item.title}
      </h1>
      {item.imageUrls?.[0] && (
        <img
          src={item.imageUrls[0]}
          alt={item.title}
          className="w-full max-w-lg h-80 object-cover rounded my-6"
        />
      )}

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

</div>)}
<div className="mt-10">

  <h2 className="
    text-2xl
    font-bold
    mb-4
  ">

    Reviews

  </h2>

  <select

    value={rating}

    onChange={(e) =>
      setRating(
        Number(
          e.target.value
        )
      )
    }

    className="
      border
      p-3
      rounded
      mb-4
      w-full
    "

  >

    <option value={5}>
      ⭐⭐⭐⭐⭐
    </option>

    <option value={4}>
      ⭐⭐⭐⭐
    </option>

    <option value={3}>
      ⭐⭐⭐
    </option>

    <option value={2}>
      ⭐⭐
    </option>

    <option value={1}>
      ⭐
    </option>

  </select>

  <textarea

    value={comment}

    onChange={(e) =>
      setComment(
        e.target.value
      )
    }

    placeholder="Comment"

    className="
      w-full
      border
      p-3
      rounded
      mb-4
    "

  />

  <button

    onClick={
      handleReview
    }

    className="
      bg-black
      text-white
      px-4
      py-2
      rounded
      mb-6
    "

  >

    Submit Review

  </button>

  <div className="space-y-4">

    {reviews.map(
      (review) => (

      <div

        key={
          review.id
        }

        className="
          border
          p-4
          rounded
        "

      >

        <p>

          {
            review.rating
          }

          /5 ⭐

        </p>

        <p>

          {
            review.comment
          }

        </p>

        <p className="text-sm text-gray-500">

          By

          {" "}

          {
            review.reviewer.name
          }

        </p>

      </div>

    ))}

  </div>

</div>
</main>
  );
}