"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/api/my-requests")
      .then((res) => setRequests(res.data));
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        My Requests
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
              Status: {request.status}
            </p>

            <p>
              Message: {request.message}
            </p>

            <p>
              Borrow From:
              {" "}
              {new Date(
                request.startDate
              ).toLocaleDateString()}
            </p>

            <p>
              Borrow Until:
              {" "}
              {new Date(
                request.endDate
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}