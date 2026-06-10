"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  
  const updateStatus = async (
  requestId: string,
  status: string
) => {
  await axios.patch(
    `/api/borrow-requests/${requestId}`,
    {
      status,
    }
  );

  setRequests((prev) =>
    prev.map((request) =>
      request.id === requestId
        ? { ...request, status }
        : request
    )
  );
};
  useEffect(() => {
    axios
      .get("/api/incoming-requests")
      .then((res) => setRequests(res.data));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Incoming Requests
      </h1>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="border p-4 rounded"
          >
            <h2 className="font-bold text-xl">
              {request.item.title}
            </h2>

            <p>
              Borrower: {request.borrower.name}
            </p>

            <p>
              Status: {request.status}
              <div className="mt-4 flex gap-2">
  <button
    onClick={() =>
      updateStatus(
        request.id,
        "APPROVED"
      )
    }
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Approve
  </button>

  <button
    onClick={() =>
      updateStatus(
        request.id,
        "REJECTED"
      )
    }
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Reject
  </button>
</div>
            </p>

            <p>
              Message: {request.message}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}