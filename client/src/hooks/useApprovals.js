import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5002/api/tickets";

export function useApprovals() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch the list of tickets needing your approval
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

  // 2. Approve one ticket by its ID, then re-fetch
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
        // Option A: remove it locally
        setPending((p) => p.filter((t) => t.ticket_id !== ticketId));
        // Option B: re-fetch
        // await fetchPending();
      } catch (err) {
        console.error("Approve failed:", err);
        setError("Failed to approve ticket.");
      } finally {
        setLoading(false);
      }
    },
    [fetchPending]
  );

  // 3. On mount (or when your department changes), load them
  useEffect(() => {
    if (user?.department) {
      fetchPending();
    }
  }, [user.department, fetchPending]);

  return {
    pending,        // array of pending-approval tickets
    approveTicket,  // call with the ticket_id you want to approve
    loading,
    error,
    refresh: fetchPending,
  };
}