// src/components/ui/pages/TicketDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function TicketDetailPage() {
  const { ticketId } = useParams();    // e.g. "123"
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);

  // 1) Fetch ticket (with requester & attachments)
  const fetchTicket = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/tickets/${ticketId}`);
      const data = await res.json();
      setTicket(data);
      setStatus(data.status);
      // If your GET /tickets/:id also returns ticket.updates and/or attachments
      // you can set those here. Otherwise fetch them separately.
    } catch (err) {
      console.error("Error loading ticket:", err);
    }
  };

  // 2) Fetch ticket-updates
  const fetchUpdates = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/tickets/${ticketId}/updates`);
      const data = await res.json();
      setUpdates(data);
    } catch (err) {
      console.error("Error loading ticket updates:", err);
    }
  };

  // 3) Fetch attachments
  const fetchAttachments = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/tickets/${ticketId}/attachments`);
      const data = await res.json();
      setAttachments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading attachments:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchTicket(), fetchUpdates(), fetchAttachments()]);
      setLoading(false);
    };
    loadAll();
  }, [ticketId]);

  // Print handler
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket #${ticket.ticket_id} - ${ticket.purpose}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .ticket-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .info-item {
            display: flex;
            flex-direction: column;
          }
          .info-label {
            font-weight: 600;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 16px;
            color: #111827;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-viewed { background: #dbeafe; color: #1d4ed8; }
          .status-processing { background: #fef3c7; color: #d97706; }
          .status-resolved { background: #d1fae5; color: #059669; }
          .status-unresolved { background: #fee2e2; color: #dc2626; }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
          }
          .description-box {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 20px;
            white-space: pre-line;
            line-height: 1.8;
          }
          .person-info {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
          }
          .person-name {
            font-weight: 600;
            font-size: 16px;
            color: #111827;
            margin-bottom: 5px;
          }
          .person-details {
            color: #6b7280;
            font-size: 14px;
          }
          .activity-item {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .activity-user {
            font-weight: 600;
            color: #111827;
          }
          .activity-time {
            color: #6b7280;
            font-size: 12px;
          }
          .activity-status {
            margin: 10px 0;
          }
          .activity-remarks {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            margin-top: 10px;
            font-style: italic;
          }
          .attachments-list {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 15px;
          }
          .attachment-item {
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .attachment-item:last-child {
            border-bottom: none;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
            .no-break { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Support Ticket #${ticket.ticket_id}</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
        </div>

        <div class="ticket-info no-break">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Ticket Subject</div>
              <div class="info-value">${ticket.purpose}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Current Status</div>
              <div class="info-value">
                <span class="status-badge status-${ticket.status}">
                  ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Created Date</div>
              <div class="info-value">${new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Last Updated</div>
              <div class="info-value">${new Date(ticket.updatedAt).toLocaleString()}</div>
            </div>
          </div>
          ${ticket.requires_manager_approval ? '<div style="color: #d97706; font-weight: 600; text-align: center;">⚠️ Manager Approval Required</div>' : ''}
        </div>

        <div class="section no-break">
          <div class="section-title">Requester Information</div>
          <div class="person-info">
            <div class="person-name">${ticket.requester.username}</div>
            <div class="person-details">
              ${ticket.requester.department} Department<br>
              User ID: ${ticket.requester.user_id}
            </div>
          </div>
        </div>

        <div class="section no-break">
          <div class="section-title">Assigned Department</div>
          <div class="person-info">
            <div class="person-name">${ticket.responding_department} Team</div>
            <div class="person-details">
              Ticket Type: ${ticket.requires_manager_approval ? 'Manager Approval Required' : 'Standard Ticket'}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Description</div>
          <div class="description-box">${ticket.description}</div>
        </div>

        ${attachments.length > 0 ? `
        <div class="section">
          <div class="section-title">Attachments (${attachments.length})</div>
          <div class="attachments-list">
            ${attachments.map(att => `
              <div class="attachment-item">
                📎 ${att.filename}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${updates.length > 0 ? `
        <div class="section">
          <div class="section-title">Activity History (${updates.length} updates)</div>
          ${updates.map(u => `
            <div class="activity-item no-break">
              <div class="activity-header">
                <div class="activity-user">${u.updater.username} (${u.updater.role})</div>
                <div class="activity-time">${new Date(u.updatedAt).toLocaleString()}</div>
              </div>
              <div class="activity-status">
                Status changed to: <span class="status-badge status-${u.status}">${u.status.charAt(0).toUpperCase() + u.status.slice(1)}</span>
              </div>
              ${u.remarks ? `<div class="activity-remarks"><strong>Remark:</strong><br>${u.remarks}</div>` : ''}
              <div style="color: #6b7280; font-size: 12px; margin-top: 8px;">
                ${u.responding_department} Department
              </div>
            </div>
          `).join('')}
        </div>
        ` : `
        <div class="section">
          <div class="section-title">Activity History</div>
          <div class="activity-item">
            <div style="text-align: center; color: #6b7280; padding: 20px;">
              No activity recorded yet
            </div>
          </div>
        </div>
        `}

        <div class="footer">
          <div>This document was automatically generated from the support ticket system.</div>
          <div>For questions or concerns, please contact the IT Support Team.</div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait a moment for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
  const handleSave = async () => {
    if (!ticket) return;

    const updatePromise = async () => {
      const response = await fetch(`http://localhost:5002/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          responding_department: user.department,
          purpose: ticket.purpose,
          description: ticket.description,
          status,
          remarks,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update ticket");
      }

      // Refresh everything after a successful save
      await Promise.all([fetchTicket(), fetchUpdates(), fetchAttachments()]);
      // Reset local remarks textbox
      setRemarks("");
      return true;
    };

    toast.promise(updatePromise(), {
      loading: "Saving ticket...",
      success: "Ticket saved!",
      error: (err) => `Save failed: ${err.message}`,
    });
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'viewed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unresolved':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-gray-700">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  // Determine if the current user is the ticket’s creator
  const isCreator = ticket.requester.user_id === user.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header with Back Button and Print Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Tickets</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="group flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-emerald-100"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="font-medium">Print Ticket</span>
          </button>
        </div>

        {/* Main Ticket Header Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{ticket.purpose}</h1>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full border">
                    #{ticket.ticket_id}
                  </span>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                  {ticket.requires_manager_approval && (
                    <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full border border-orange-200">
                      Manager Approval Required
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Last Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* From/To Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">From</h2>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">{ticket.requester.username}</p>
              <p className="text-blue-600 font-medium">{ticket.requester.department} Department</p>
              <p className="text-sm text-gray-500">ID: {ticket.requester.user_id}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">To</h2>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">{ticket.responding_department} Team</p>
              <p className="text-purple-600 font-medium">
                {ticket.requires_manager_approval ? "Manager Approval Required" : "Standard Ticket"}
              </p>
              <p className="text-sm text-gray-500">Ticket ID: #{ticket.ticket_id}</p>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50/50 p-6 rounded-xl border border-gray-100">
              {ticket.description}
            </div>
          </div>
        </div>

        {/* Attachments Card */}
        {attachments.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Attachments</h2>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {attachments.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {attachments.map((att) => {
                const url = `http://localhost:5002${att.url}`;
                const ext = att.filename.split(".").pop().toLowerCase();
                return (
                  <div key={att.attachment_id} className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    {ext === "pdf" && (
                      <embed
                        src={url}
                        type="application/pdf"
                        width="100%"
                        height="300px"
                        className="mb-4 border rounded-lg shadow-sm"
                      />
                    )}
                    {/\.(png|jpe?g|gif)$/i.test(att.filename) && (
                      <img
                        src={url}
                        alt={att.filename}
                        className="max-h-48 w-full object-cover rounded-lg mb-4 shadow-sm"
                      />
                    )}
                    <a
                      href={url}
                      download={att.filename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center space-x-3 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                        {ext === "pdf" ? (
                          <span className="text-lg">📄</span>
                        ) : ext === "docx" ? (
                          <span className="text-lg">📝</span>
                        ) : (
                          <span className="text-lg">📎</span>
                        )}
                      </div>
                      <span className="group-hover:underline">{att.filename}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Log Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
            {updates.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                {updates.length} updates
              </span>
            )}
          </div>
          
          {updates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No activity recorded yet</p>
              <p className="text-sm text-gray-400">Updates will appear here when actions are taken</p>
            </div>
          ) : (
            <div className="space-y-6">
              {updates.map((u, index) => (
                <div key={u.ticket_update_id} className="relative">
                  {index !== updates.length - 1 && (
                    <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-gray-200 to-transparent"></div>
                  )}
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {u.updater.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <p className="font-semibold text-gray-900">{u.updater.username}</p>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {u.updater.role}
                          </span>
                        </div>
                        <time className="text-sm text-gray-500 font-medium">
                          {new Date(u.updatedAt).toLocaleString()}
                        </time>
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-700">
                          Status changed to{" "}
                          <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(u.status)}`}>
                            {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                          </span>
                        </p>
                        {u.remarks && (
                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <p className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>Remark:</span>
                            </p>
                            <p className="whitespace-pre-line text-gray-700 leading-relaxed">{u.remarks}</p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{u.responding_department} Department</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Update Form Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Update Ticket</h2>
          </div>
          
          <div className={`grid ${isCreator ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-6 mb-6`}>
            {!isCreator &&
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="viewed">👁️ Viewed</option>
                  <option value="processing">⚙️ Processing</option>
                  <option value="resolved">✅ Resolved</option>
                  <option value="unresolved">❌ Unresolved</option>
                </select>
              </div>
            }
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Remarks
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add your comment or update here..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}