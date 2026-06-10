"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

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