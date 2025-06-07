import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketModal from "../tickets/TicketModal";
import { useAuth } from "../../../context/AuthContext";
import { useTickets } from "../../../hooks/useTickets";
import { toast } from "react-hot-toast";

export default function DepartmentTicketList({ departmentTickets, refetchDepartmentTickets, viewTicket, saveTicket, loading }) {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleClick = async (ticket) => {
    await viewTicket(ticket);
    navigate(`/tickets/${ticket.ticket_id}`);
  };
  
  const handleSave = async (id, updates) => {
    await saveTicket(id, updates, selectedTicket, () => {
      setSelectedTicket(null);
    });
  };

  if (loading) return <p>Loading department tickets...</p>;

  const statusOptions = [
    { value: "viewed", label: "Viewed", color: "bg-blue-100 hover:bg-blue-200 text-blue-800", text: "bg-blue-200 text-blue-800" },
    { value: "pending_approval", label: "Pending Approval", color: "bg-purple-100 hover:bg-purple-200 text-purple-800", text: "bg-purple-200 text-purple-800" },
    { value: "pending", label: "Pending", color: "bg-orange-100 hover:bg-orange-200 text-orange-800", text: "bg-orange-200 text-orange-800" },
    { value: "processing", label: "Processing", color: "bg-purple-100 hover:bg-purple-200 text-purple-800", text: "bg-purple-200 text-purple-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 hover:bg-green-200 text-green-800", text: "bg-green-200 text-green-800" },
    { value: "unresolved", label: "Unresolved", color: "bg-red-100 hover:bg-red-200 text-red-800", text: "bg-red-200 text-red-800" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-xl font-bold">Department Tickets</h2> */}
        <div className="text-sm text-gray-500">
          Showing {departmentTickets.length} {departmentTickets.length === 1 ? "ticket" : "tickets"}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID#
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(departmentTickets) && departmentTickets.length > 0 ? (
              departmentTickets.map((t, idx) => (
                <tr 
                  key={idx} 
                  className={`cursor-pointer ${statusOptions.find(o => o.value === t.status)?.color}`}
                  onClick={() => handleClick(t)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {t.ticket_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{t.requester?.username ?? "-"}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{t.requester?.department ?? "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(t.updatedAt).toLocaleDateString()}
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
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}