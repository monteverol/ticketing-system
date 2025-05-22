import { useEffect, useState } from "react";
import TicketItem from "./TicketItem";

export default function AdminTicketList() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5002/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setFiltered(data);
      })
      .catch(() => alert("Failed to fetch tickets"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filteredData = [...tickets];

    if (search) {
      filteredData = filteredData.filter((t) =>
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter) {
      filteredData = filteredData.filter((t) => t.priority === priorityFilter);
    }

    setFiltered(filteredData);
  }, [search, statusFilter, priorityFilter, tickets]);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">All Tickets</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
      </div>

      {filtered.map((t) => (
        <TicketItem
          key={t.id}
          ticket={t}
          canUpdateStatus={true}
        />
      ))}
    </div>
  );
}
