import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ManagerApprovalList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/tickets/pending-approvals/${user.department}`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  };

  const approveTicket = async (ticketId) => {
    try {
      const res = await fetch(`http://localhost:5002/api/tickets/${ticketId}/approve`, {
        method: "PUT",
      });

      const updated = await res.json();
      setTickets((prev) => prev.filter((t) => t.ticket_id !== ticketId));
    } catch (err) {
      console.error("Approval failed");
    }
  };

  useEffect(() => {
    if (user?.department) fetchApprovals();
  }, [user]);

  if (loading) return <p>Loading pending approvals...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tickets Pending Your Approval</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No approval requests.</p>
      ) : (
        tickets.map((t) => (
          <div key={t.ticket_id} className="p-4 bg-white shadow rounded border">
            <h3 className="font-semibold">{t.purpose}</h3>
            <p>{t.description}</p>
            <p className="text-sm text-gray-600">
              From: {t.username} ({t.requesting_department}) → To: {t.responding_department}
            </p>
            <button
              onClick={() => approveTicket(t.ticket_id)}
              className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}
