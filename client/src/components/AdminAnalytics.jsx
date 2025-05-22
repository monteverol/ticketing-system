import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5002/api/tickets/analytics")
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("Failed to fetch analytics"));
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="p-4 bg-white rounded shadow space-y-2">
      <h2 className="text-xl font-bold">Ticket Analytics</h2>
      <p>Total Tickets: <strong>{data.total}</strong></p>

      <div>
        <h3 className="font-semibold">By Status:</h3>
        <ul className="list-disc pl-5">
          {data.status.map((s) => (
            <li key={s.status}>{s.status}: {s.count}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">By Department:</h3>
        <ul className="list-disc pl-5">
          {data.department.map((d) => (
            <li key={d.department}>{d.department}: {d.count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
