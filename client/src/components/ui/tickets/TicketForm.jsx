import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTickets } from "../../../hooks/useTickets";

export default function TicketForm({ setSubmitTicketModal, initialData = null }) {
  const { user } = useAuth();
  const { createTicket } = useTickets(user.username);
  const [purpose, setPurpose] = useState(initialData?.purpose || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [respondingDepartment, setRespondingDepartment] = useState("IT");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    // e.target.files is a FileList — convert to Array
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("description", description);
    formData.append("responding_department", respondingDepartment);
    formData.append("requires_manager_approval", requiresApproval);
    formData.append("user_id", user.user_id);

    // append each file under the same key ("attachments")
    files.forEach((file) => formData.append("attachments", file));

    createTicket(formData);

    setPurpose("");
    setDescription("");
    setRespondingDepartment("IT");
    setRequiresApproval(false);
    setFiles([]);
    setSubmitTicketModal(false);
  };

  return (
   <div className="bg-black bg-opacity-50 fixed top-0 left-0 h-screen w-screen backdrop-blur-sm grid items-center justify-center z-50">
     <div className="bg-white p-8 rounded-2xl drop-shadow-md relative">
        <button 
          className="w-8 h-8 grid items-center justify-center bg-slate-100 hover:bg-slate-300 rounded-full font-bold absolute top-8 right-8"
          onClick={() => setSubmitTicketModal(false)}
        >
          <X size={16} />
        </button>
        <h1 className="text-2xl font-bold mb-4">Submit a ticket</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={respondingDepartment}
            onChange={(e) => setRespondingDepartment(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Admin">Admin</option>
            {/* Add more if needed */}
          </select>
          <input
            type="text"
            placeholder="Purpose"
            className="w-full border p-2 rounded"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
            />
            Requires manager approval
          </label>
          <div>
            <label className="block text-sm font-medium">Attachments</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1"
            />
            {files.length > 0 && (
              <ul className="text-xs mt-1">
                {files.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {initialData ? "Update Ticket" : "Submit Ticket"}
          </button>
        </form>
     </div>
   </div>
  );
}
