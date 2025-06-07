import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import useSocket from "./useSocket"; // 🔥 NEW
import { toast } from "react-hot-toast"; // optional but nice

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
const API_URL = `${BASE_URL}/api/tickets`;

export function useApprovals() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Handle real-time updates
  useSocket(
    (newTicket) => {
      // If it needs manager approval AND is for my department, add it
      if (
        newTicket.requires_manager_approval &&
        newTicket.status === "pending_approval" &&
        newTicket.responding_department === user?.department
      ) {
        setPending((prev) => [newTicket, ...prev]);
        toast.success("New ticket pending approval");
      }
    },
    (updatedTicket) => {
      // If ticket was approved or no longer pending_approval, remove it
      if (
        updatedTicket.responding_department === user?.department &&
        updatedTicket.status !== "pending_approval"
      ) {
        setPending((prev) =>
          prev.filter((t) => t.ticket_id !== updatedTicket.ticket_id)
        );
      }
    }
  );

  // 🔄 Fetch pending tickets for manager's department
  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/pending-approvals/${user.department}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error("Failed to load pending approvals:", err);
      setError("Could not load pending tickets.");
    } finally {
      setLoading(false);
    }
  }, [user.department]);

  // ✅ Approve ticket
  const approveTicket = useCallback(
    async (ticketId) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${ticketId}/approve`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.user_id,
            responding_department: user.department
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        // Remove it locally
        setPending((p) => p.filter((t) => t.ticket_id !== ticketId));
      } catch (err) {
        console.error("Approve failed:", err);
        setError("Failed to approve ticket.");
        toast.error("Approval failed");
      } finally {
        setLoading(false);
      }
    },
    [fetchPending]
  );

  useEffect(() => {
    if (user?.department) {
      fetchPending();
    }
  }, [user.department, fetchPending]);

  return {
    pending,
    approveTicket,
    loading,
    error,
    refresh: fetchPending,
  };
}
