import { useState, useEffect } from "react";

export default function TicketApproval({ ticket, onClose, approveTicket, loading }) {
  const [status, setStatus] = useState(ticket.status);
  const [remarks, setRemarks] = useState("");
  const [updates, setUpdates] = useState([]);
  
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/tickets/${ticket.ticket_id}/updates`);
        const data = await res.json();

        // after fetch…
        if (!Array.isArray(data)) {
          console.error("unexpected updates payload", data);
          setUpdates([]);
        } else {
          setUpdates(data);
        }
      } catch (err) {
        console.error("Failed to load update history:", err.message);
      }
    };

    fetchUpdates();
  }, [ticket.ticket_id]);

  const statusOptions = [
    { value: "viewed", label: "Viewed", color: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Processing", color: "bg-yellow-100 text-yellow-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
    { value: "unresolved", label: "Unresolved", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex">
        {/* Left Panel - Ticket Details */}
        <div className="w-full border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-800">{ticket.purpose}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sender/Receiver Info */}
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 border-r">
              <h3 className="text-sm font-medium text-gray-500 mb-2">FROM</h3>
              <div className="space-y-1">
                <p className="font-medium">{ticket.requester.username}</p>
                <p className="text-sm text-gray-600">{ticket.requesting_department} Department</p>
                <p className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">TO</h3>
              <div className="space-y-1">
                <p className="font-medium">{ticket.responding_department} Team</p>
                <p className="text-sm text-gray-600">
                  {ticket.requires_manager_approval ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      Requires Manager Approval
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Standard Ticket
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">Ticket ID: #{ticket.ticket_id}</p>
              </div>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="p-6 space-y-4 flex-grow overflow-y-auto">
            <span className={`px-3 py-2 rounded-md text-sm font-medium ${statusOptions.find(o => o.value === status)?.color}`}>
              Current: {statusOptions.find(o => o.value === status)?.label}
            </span>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{ticket.description}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                rows={3}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your comment here..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 bg-red-400 hover:bg-red-500 rounded-md text-sm font-medium text-white"
            >
              Reject
            </button>
            <button
              disabled={loading}
              onClick={approveTicket}
              className={`${loading ? "bg-gray-200 text-black" : null} px-8 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? "Loading..." : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}