"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/api/dashboard")
      .then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="border p-6 rounded">
          <h2 className="text-xl font-bold">
            My Items
          </h2>
          <p className="text-3xl mt-2">
            {stats.myItems}
          </p>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-bold">
            Incoming Requests
          </h2>
          <p className="text-3xl mt-2">
            {stats.incomingRequests}
          </p>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-bold">
            My Requests
          </h2>
          <p className="text-3xl mt-2">
            {stats.outgoingRequests}
          </p>
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl font-bold">
            Approved Requests
          </h2>
          <p className="text-3xl mt-2">
            {stats.approvedRequests}
          </p>
        </div>

      </div>
    </main>
  );
}