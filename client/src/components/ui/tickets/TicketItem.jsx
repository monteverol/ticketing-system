import { useState } from "react";

export default function TicketItem({ ticket, canUpdateStatus, onStatusChange }) {
  const [status, setStatus] = useState(ticket.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    await fetch(`http://localhost:5002/api/tickets/${ticket.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (onStatusChange) onStatusChange(ticket.id, newStatus);
  };

  return (
    <div className="p-4 bg-white shadow rounded border space-y-1">
      <h3 className="font-semibold">{ticket.subject}</h3>
      <p className="text-sm text-gray-600">
        From: {ticket.requesting_department || ticket.username + " (" + ticket.requesting_dept + ")"} →
        To: {ticket.department}
      </p>
      <p>{ticket.description}</p>
      <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>
      <p className="text-sm text-gray-600">Submitted by: {ticket.username}</p>
      <div className="text-sm text-gray-600">
        Status:{" "}
        {canUpdateStatus ? (
          <select
            value={status}
            onChange={handleStatusChange}
            className="border p-1 rounded text-sm"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        ) : (
          <span>{status}</span>
        )}
      </div>
    </div>
  );
}
