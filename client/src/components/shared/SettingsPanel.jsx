import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function SettingsPanel() {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`http://localhost:5002/api/users/${user.user_id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        toast.success("Password updated");
        setPassword("");
        setConfirm("");
      } else {
        toast.error("Failed to update password");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
        <p><span className="font-semibold">Username:</span> {user?.username}</p>
        <p><span className="font-semibold">Department:</span> {user?.department}</p>
        <p><span className="font-semibold">Role:</span> {user?.role}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}