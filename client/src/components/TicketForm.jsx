import { useState } from "react";
import { X } from "lucide-react";

export default function TicketForm({ onSubmit, setSubmitTicketModal, initialData = null }) {
  const [purpose, setPurpose] = useState(initialData?.purpose || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [requiresApproval, setRequiresApproval] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      purpose,
      description,
      responding_department: department,
      requires_manager_approval: requiresApproval
    }); // department = responding dept
    setPurpose("");
    setDescription("");
    setDepartment("");
  };

  return (
   <div className="bg-black bg-opacity-50 fixed top-0 left-0 h-screen w-screen backdrop-blur-sm grid items-center justify-center">
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
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
