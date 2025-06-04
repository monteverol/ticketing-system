import { useState } from "react";
import TicketApproval from "../tickets/TicketApproval";
import { useApprovals } from "../../../hooks/useApprovals";

export default function ManagerApprovalList() {
  const { pending, approveTicket, loading, error, refresh } = useApprovals();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleClick = (t) => {
    setSelectedTicket(t);
  }

  if (loading) return <p>Loading pending approvals...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tickets Pending Your Approval</h2>
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(pending) ? (
            pending.map((t, idx) => (
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
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    t.status === "pending" ? "bg-blue-100 text-blue-800" :
                    t.status === "resolved" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
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

      {/* MODAL */}
      { 
        selectedTicket && 
        <TicketApproval 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)} 
          approveTicket={ async () => {
            await approveTicket(selectedTicket.ticket_id);
            setSelectedTicket(null);
          }}
          loading={loading}
        /> 
      }
    </div>
  );
}
