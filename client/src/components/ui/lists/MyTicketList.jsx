import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketForm from "../tickets/TicketForm";
import ViewTicket from "../tickets/ViewTicket";
import { useAuth } from "../../../context/AuthContext";
import { useTickets } from "../../../hooks/useTickets";

export default function MyTicketList() {
  const navigate = useNavigate();
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState();
  const { user } = useAuth();
  const { tickets, updateTicket, loading, error } = useTickets(user.username);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const handleUpdate = (updatedFields) => {
    updateTicket(editingTicket.id, updatedFields);
    setEditingTicket(null);
  };

  const handleClick = async (ticket) => {
    navigate(`/tickets/${ticket.ticket_id}`);
  };

  const handleSave = async (id, updates) => {
    await fetch(`http://localhost:5002/api/tickets/${id}`, {
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
  };

  const statusOptions = [
    { value: "viewed", label: "Viewed", color: "bg-blue-100 hover:bg-blue-200 text-blue-800", text: "bg-blue-200 text-blue-800" },
    { value: "pending_approval", label: "Pending Approval", color: "bg-purple-100 hover:bg-purple-200 text-purple-800", text: "bg-purple-200 text-purple-800" },
    { value: "pending", label: "Pending", color: "bg-orange-100 hover:bg-orange-200 text-orange-800", text: "bg-orange-200 text-orange-800" },
    { value: "processing", label: "Processing", color: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800", text: "bg-yellow-200 text-yellow-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 hover:bg-green-200 text-green-800", text: "bg-green-200 text-green-800" },
    { value: "unresolved", label: "Unresolved", color: "bg-red-100 hover:bg-red-200 text-red-800", text: "bg-red-200 text-red-800" },
  ];

  // console.log(tickets);

  return (
    <div className="space-y-4">
      {/* REPLACE FOR FILTERS AND SEARCH */}
      {/* <h2 className="text-xl font-semibold">My Tickets</h2> */}
      
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
                  className={`cursor-pointer ${statusOptions.find(o => o.value === t.status)?.color}`}
                  onClick={() => handleClick(t)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{t.ticket_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{t.requester.username}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{t.requester.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 uppercase">{t.purpose}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{t.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusOptions.find(o => o.value === t.status)?.text}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.requires_manager_approval ? (
                      <span className={`${t.requires_manager_approval && t.status !== "pending_approval" ? "bg-green-100 text-green-800" : "bg-red-200 text-red-800"} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
                        {t.requires_manager_approval && t.status !== "pending_approval" ? "Approved": "Required"}
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
