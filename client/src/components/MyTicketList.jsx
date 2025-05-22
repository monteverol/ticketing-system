import { useState } from "react";
import TicketForm from "./TicketForm";
import TicketModal from "./TicketModal";
import ViewTicket from "./ViewTicket";
import { useAuth } from "../context/AuthContext";

export default function MyTicketList({ tickets, updateTicket, loading, error }) {
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState();
  const { user } = useAuth();

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const handleUpdate = (updatedFields) => {
    updateTicket(editingTicket.id, updatedFields);
    setEditingTicket(null);
  };

  const handleClick = async (ticket) => {
    if (ticket.status === "pending") {
      const res = await fetch(`http://localhost:5002/api/tickets/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          responding_department: user.department,
          purpose: ticket.purpose,
          description: ticket.description,
          status: "viewed",
          remarks: ticket.remarks || "",
        }),
      });

      const updated = await res.json();
      setSelectedTicket(updated);
    } else {
      setSelectedTicket(ticket);
    }
  };

  const handleSave = async (id, updates) => {
    const res = await fetch(`http://localhost:5002/api/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...updates,
        user_id: user.user_id,
        responding_department: user.department,
        purpose: selectedTicket.purpose,
        description: selectedTicket.description,
      }),
    });
    const updated = await res.json();
    setTickets((prev) =>
      prev.map((t) => (t.ticket_id === id ? updated : t))
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Tickets</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(tickets) ? (
              tickets.map((t, idx) => (
                <tr 
                  key={idx} 
                  className={`cursor-pointer hover:bg-gray-50 ${
                    t.status === "pending" ? "bg-blue-50" : 
                    t.status === "resolved" ? "bg-green-50" : ""
                  }`}
                  onClick={() => handleClick(t)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{t.ticket_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{t.username}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{t.requesting_department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 uppercase">{t.purpose}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{t.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.status === "pending" ? "bg-blue-100 text-blue-800" :
                      t.status === "resolved" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.requires_manager_approval ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not required
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-red-600">
                  Error loading tickets
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {selectedTicket && (
        <ViewTicket
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSave={handleSave}
        />
      )}

      {editingTicket && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Update Ticket</h3>
          <TicketForm initialData={editingTicket} onSubmit={handleUpdate} />
        </div>
      )}
    </div>
  );
}
