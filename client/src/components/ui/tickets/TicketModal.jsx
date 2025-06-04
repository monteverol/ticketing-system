import { useState, useEffect } from "react";

export default function TicketModal({ ticket, onClose, onSave }) {
  const [status, setStatus] = useState(ticket.status);
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

  const handleSave = () => {
    onSave(ticket.ticket_id, { status, remarks });
    setRemarks("");
    onClose();
  };

  const statusOptions = [
    { value: "viewed", label: "Viewed", color: "bg-blue-100 text-blue-800" },
    { value: "processing", label: "Processing", color: "bg-yellow-100 text-yellow-800" },
    { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
    { value: "unresolved", label: "Unresolved", color: "bg-red-100 text-red-800" },
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=900,height=650');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Support Ticket #${ticket.ticket_id} - ${ticket.purpose}</title>
        <style>
          body { 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.5; 
            color: #333; 
            margin: 0;
            padding: 20px;
          }
          .letterhead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #003366;
          }
          .company-info {
            text-align: left;
          }
          .company-name {
            font-size: 22px;
            font-weight: bold;
            color: #003366;
            margin-bottom: 5px;
          }
          .document-meta {
            text-align: right;
            font-size: 14px;
          }
          .document-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin: 25px 0;
            color: #003366;
          }
          .ticket-header {
            background-color: #f5f5f5;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .ticket-id {
            font-weight: bold;
            color: #003366;
          }
          .section { 
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            font-weight: bold;
            font-size: 16px;
            color: #003366;
            border-bottom: 1px solid #003366;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 8px;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .activity-log {
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
          }
          .activity-item {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
          }
          .activity-item:last-child {
            border-bottom: none;
          }
          .activity-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .activity-user {
            font-weight: bold;
            color: #003366;
          }
          .activity-time {
            color: #666;
            font-size: 0.9em;
          }
          .activity-status {
            font-style: italic;
            margin: 5px 0;
          }
          .activity-remarks {
            margin-top: 8px;
            padding: 8px;
            background: #f9f9f9;
            border-left: 3px solid #003366;
            border-radius: 2px;
          }
          .content-box {
            padding: 12px;
            border: 1px solid #eee;
            border-radius: 4px;
            background-color: #fafafa;
            margin-top: 8px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .signature-line {
            margin-top: 40px;
            border-top: 1px solid #000;
            width: 250px;
            display: inline-block;
          }
          @page { 
            size: A4;
            margin: 15mm;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <div class="company-info">
            <div class="company-name">NAESS Shipping Philippines Inc.</div>
            <div>2215 Leon Guinto St., Malate, Manila, 1004 Metro Manila</div>
            <div>Tax ID: 123456789 | it@naess.com.ph</div>
          </div>
          <div class="document-meta">
            <div><strong>Document:</strong> Support Ticket</div>
            <div><strong>Printed:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Confidentiality:</strong> Internal Use Only</div>
          </div>
        </div>

        <div class="document-title">
          SUPPORT TICKET DOCUMENTATION
        </div>

        <div class="ticket-header">
          <div class="info-grid">
            <div class="info-label">Ticket ID:</div>
            <div class="ticket-id">#${ticket.ticket_id}</div>
            <div class="info-label">Subject:</div>
            <div>${ticket.purpose}</div>
            <div class="info-label">Status:</div>
            <div>${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</div>
            <div class="info-label">Created:</div>
            <div>${new Date(ticket.created_at).toLocaleString()}</div>
          </div>
        </div>

        <div class="two-column">
          <div class="section">
            <div class="section-title">Requestor Information</div>
            <div class="info-grid">
              <div class="info-label">Name:</div>
              <div>${ticket.username}</div>
              <div class="info-label">Department:</div>
              <div>${ticket.requesting_department}</div>
              <div class="info-label">User ID:</div>
              <div>${ticket.user_id}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Assigned Information</div>
            <div class="info-grid">
              <div class="info-label">Department:</div>
              <div>${ticket.responding_department}</div>
              <div class="info-label">Approval Level:</div>
              <div>${ticket.requires_manager_approval ? 'Manager Approval Required' : 'Standard Ticket'}</div>
              <div class="info-label">Last Updated:</div>
              <div>${new Date(ticket.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Ticket Description</div>
          <div class="content-box">
            ${ticket.description.split('\n').map(para => `<p>${para}</p>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Current Resolution Notes</div>
          <div class="content-box">
            ${ticket.remarks ? ticket.remarks.split('\n').map(para => `<p>${para}</p>`).join('') : 'No resolution notes provided'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Audit Trail</div>
          <div class="activity-log">
            ${updates.length > 0 ? 
              updates.map(u => `
                <div class="activity-item">
                  <div class="activity-header">
                    <span class="activity-user">${u.responding_department} | ${u.username} (ID: ${u.user_id})</span>
                    <span class="activity-time">${new Date(u.updated_at).toLocaleString()}</span>
                  </div>
                  <div class="activity-status">Status changed to: <strong>${u.status.charAt(0).toUpperCase() + u.status.slice(1)}</strong></div>
                  ${u.remarks ? `
                    <div class="activity-remarks">
                      <strong>Agent Notes:</strong> 
                      ${u.remarks.split('\n').map(para => `<p>${para}</p>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('') : 
              '<div class="activity-item"><em>No activity recorded yet</em></div>'
            }
          </div>
        </div>

        <div class="footer">
          <div>This document is system-generated and valid without signature</div>
          <div>Page 1 of 1 | Printed by ${ticket.username} on ${new Date().toLocaleString()}</div>
          <div class="no-print">CONFIDENTIAL - For internal use only</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full h-[70vh] max-w-4xl overflow-y-scroll flex flex-col relative">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">{ticket.purpose}</h2>
            <span className={`px-3 py-2 rounded-md text-sm font-medium ${statusOptions.find(o => o.value === status)?.color}`}>
              Current: {statusOptions.find(o => o.value === status)?.label}
            </span>
            <button 
              onClick={handlePrint}
              className="text-gray-500 hover:text-gray-700 p-1 px-2 rounded hover:bg-gray-200 flex gap-2"
              title="Print Ticket"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
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
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
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
        <div className="bg-gray-50 px-6 py-3 border-t h-full flex flex-row justify-between sticky bottom-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-row items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-40 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <span className={`px-3 py-2 rounded-md text-sm font-medium ${statusOptions.find(o => o.value === status)?.color}`}>
                Current: {statusOptions.find(o => o.value === status)?.label}
              </span>
            </div>
          </div>
          <div className="flex flex-row justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}