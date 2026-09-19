"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<any>(null);

  // Borrow request state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Review state
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Today's date for the minimum date allowed
  const today = new Date().toISOString().split("T")[0];

  // -----------------------------
  // Borrow Item
  // -----------------------------
  const handleBorrow = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      alert("End date must be after start date.");
      return;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (start < todayDate) {
      alert("Start date cannot be in the past.");
      return;
    }

    const borrowDays = Math.ceil(
      (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (borrowDays > item.maxBorrowDays) {
      alert(
        `You can borrow this item for a maximum of ${item.maxBorrowDays} days.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post("/api/borrow-requests", {
        itemId: item.id,
        startDate,
        endDate,
        message,
      });

      alert("Borrow request sent!");

      // Clear form after successful request
      setStartDate("");
      setEndDate("");
      setMessage("");
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Failed to send request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Submit Review
  // -----------------------------
  const handleReview = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      await axios.post("/api/reviews", {
        itemId: item.id,
        rating,
        comment: comment.trim(),
      });

      alert("Review added!");

      setComment("");

      // Refresh reviews
      const res = await axios.get(
        `/api/reviews?itemId=${id}`
      );

      setReviews(res.data);
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          "Failed to submit review"
      );
    }
  };

  // -----------------------------
  // Load Item + Reviews
  // -----------------------------
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

    axios
      .get(`/api/reviews?itemId=${id}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // -----------------------------
  // Loading
  // -----------------------------
  if (!item) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  // -----------------------------
  // Page
  // -----------------------------
  return (
    <main className="p-10 max-w-5xl mx-auto">

      {/* ========================= */}
      {/* ITEM DETAILS */}
      {/* ========================= */}

      <h1 className="text-4xl font-bold">
        {item.title}
      </h1>

      {/* Item Image */}
      {item.imageUrls?.[0] && (
        <img
          src={item.imageUrls[0]}
          alt={item.title}
          className="w-full max-w-lg h-80 object-cover rounded my-6"
        />
      )}

      {/* Description */}
      <p className="mt-4">
        {item.description}
      </p>

      {/* Category */}
      <p className="mt-4">
        Category: {item.category.name}
      </p>

      {/* Owner */}
      <p className="mt-2">
        Owner: {item.owner.name}
      </p>

      {/* Maximum Borrow Days */}
      <p className="mt-2">
        Max Borrow Days: {item.maxBorrowDays}
      </p>

      {/* Availability */}
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

      {/* ========================= */}
      {/* BORROW REQUEST */}
      {/* ========================= */}

      {item.availability && (
        <div className="mt-8 border-t pt-6">

          <h2 className="text-2xl font-bold mb-4">
            Request Borrow
          </h2>

          {/* Start Date */}
          <label className="block mb-2 font-medium">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => {
              setStartDate(e.target.value);

              // Reset end date if it becomes invalid
              if (
                endDate &&
                e.target.value >= endDate
              ) {
                setEndDate("");
              }
            }}
            className="w-full border p-3 rounded mb-4"
          />

          {/* End Date */}
          <label className="block mb-2 font-medium">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            className="w-full border p-3 rounded mb-4"
          />

          {/* Message */}
          <label className="block mb-2 font-medium">
            Message to Owner
          </label>

          <textarea
            placeholder="Tell the owner why you need this item..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="w-full border p-3 rounded mb-4"
            rows={4}
          />

          {/* Borrow Button */}
          <button
            onClick={handleBorrow}
            disabled={isSubmitting}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Sending..."
              : "Send Request"}
          </button>

        </div>
      )}

      {/* ========================= */}
      {/* REVIEWS */}
      {/* ========================= */}

      <div className="mt-10 border-t pt-6">

        <h2 className="text-2xl font-bold mb-4">
          Reviews
        </h2>

        {/* Rating */}
        <label className="block mb-2 font-medium">
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          className="border p-3 rounded mb-4 w-full"
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

        {/* Review Comment */}
        <label className="block mb-2 font-medium">
          Comment
        </label>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Write your review..."
          className="w-full border p-3 rounded mb-4"
          rows={4}
        />

        {/* Submit Review */}
        <button
          onClick={handleReview}
          className="bg-black text-white px-4 py-2 rounded mb-6"
        >
          Submit Review
        </button>

        {/* Review List */}
        <div className="space-y-4">

          {reviews.length === 0 && (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          )}

          {reviews.map((review) => (
            <div
              key={review.id}
              className="border p-4 rounded"
            >

              <p>
                {review.rating}/5 ⭐
              </p>

              <p className="mt-2">
                {review.comment}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                By {review.reviewer.name}
              </p>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}