import { useState, useEffect } from "react";

export default function TicketApproval({ ticket, onClose, approveTicket, loading }) {
  const [remarks, setRemarks] = useState("");
  const [updates, setUpdates] = useState([]);
  const [attachments, setAttachments] = useState([]);
  
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/tickets/${ticket.ticket_id}/updates`);
        const data = await res.json();
        setUpdates(data);
      } catch (err) {
        console.error("Failed to load update history:", err.message);
      }
    };

    const fetchAttachments = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/tickets/${ticket.ticket_id}/attachments`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("unexpected updates payload", data);
          setAttachments([]);
        } else {
          setAttachments(data);
        }
      } catch (err) {
        console.error("Failed to load update history:", err.message);
      }
    }

    fetchUpdates();
    fetchAttachments();
  }, [ticket.ticket_id]);

  const statusOptions = [
    { value: "pending_approval", label: "Pending Approval", color: "bg-amber-400 text-amber-800" },
    { value: "viewed", label: "Viewed", color: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Processing", color: "bg-yellow-100 text-yellow-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
    { value: "unresolved", label: "Unresolved", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm m-0">
      <div className="bg-white rounded-lg shadow-xl w-full h-[70vh] max-w-4xl overflow-y-scroll flex flex-col relative">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">{ticket.purpose}</h2>
            <span className={`px-3 py-2 rounded-md text-sm font-medium ${statusOptions.find(o => o.value === ticket.status)?.color}`}>
              Current: {statusOptions.find(o => o.value === ticket.status)?.label}
            </span>
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
        {/* Left Panel - Ticket Details */}
        <div className="w-full border-gray-200 flex flex-col">
          {/* Sender/Receiver Info */}
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 border-r">
              <h3 className="text-sm font-medium text-gray-500 mb-2">FROM</h3>
              <div className="space-y-1">
                <p className="font-medium">{ticket.requester.username}</p>
                <p className="text-sm text-gray-600">{ticket.requester.department} Department</p>
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
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Details</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{ticket.description}</p>
              </div>
              <div>
                {attachments.length !== 0 && (
                  attachments.map(att => {
                    // full public URL to the file
                    const url = `http://localhost:5002${att.url}`;
                    // get extension
                    const ext = att.filename.split(".").pop().toLowerCase();

                    return (
                      <div key={att.attachment_id} className="my-4">
                        {ext === "pdf" ? (
                          // inline PDF viewer
                          <embed
                            src={url}
                            type="application/pdf"
                            width="100%"
                            height="400px"
                            className="mb-2 border rounded-md"
                          />
                        ) : null}

                        {/\.(png|jpe?g|gif)$/i.test(att.filename) && (
                          <img
                            src={`http://localhost:5002${att.url}`}
                            alt={att.filename}
                            className="max-h-32 block mb-1"
                          />
                        )}

                        <a
                          href={url}
                          download={att.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:underline"
                        >
                          {/* Optionally swap icons by extension */}
                          {ext === "pdf" ? (
                            <span role="img" aria-label="pdf">📄</span>
                          ) : ext === "docx" ? (
                            <span role="img" aria-label="doc">📝</span>
                          ) : (
                            <span role="img" aria-label="file">📎</span>
                          )}
                          <span>{att.filename}</span>
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Update Timeline */}
        <div className="w-full bg-gray-50 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Activity Log</h3>
          </div>
          <div className="flex-grow p-4">
            {updates.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No activity recorded yet
              </div>
            ) : (
              <ul className="space-y-4">
                {updates.map((u, idx) => (
                  <li key={idx} className="relative pb-4 last:pb-0">
                    <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                    {idx === 0 && (
                      <div className="absolute left-3.5 top-3 h-2 w-2 rounded-full bg-blue-500 border-2 border-white"></div>
                    )}
                    <div className="relative flex gap-x-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${idx === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <svg className={`h-5 w-5 ${idx === 0 ? 'text-blue-500' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between gap-x-2">
                          <p className="text-sm font-medium text-gray-900">{u.updater.username}</p>
                          <time className="flex-none text-xs text-gray-500">
                            {new Date(u.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </time>
                        </div>
                        <p className="text-sm text-gray-700">
                          Changed status to <span className={`font-medium px-2 py-1 capitalize ${statusOptions.find(o => o.value === u.status)?.color}`}>{u.status}</span>
                        </p>
                        {u.remarks && (
                          <div className="mt-1 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                            {/* <p className="font-medium">Note:</p> */}
                            <p className="whitespace-pre-line">{u.remarks}</p>
                          </div>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          {u.responding_department} Department | {new Date(u.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea
              rows={3}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add your comment here..."
            />
          </div> */}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t h-full flex flex-row justify-end sticky bottom-0">
          <div className="flex flex-row justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-white bg-rose-400 hover:bg-rose-500"
            >
              Reject
            </button>
            <button
              onClick={approveTicket}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}