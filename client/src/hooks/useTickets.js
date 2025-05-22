import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5002/api/tickets";

export function useTickets(username) {
  const { user } = useAuth(); // ✅ to access department
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}?user_id=${user.user_id}`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticket) => {
    try {
      const res = await fetch("http://localhost:5002/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ticket,              // contains purpose, description, department
          user_id: user.user_id   // requesting user
        }),
      });

      const newTicket = await res.json();

      if (res.ok) {
        setTickets((prev) => [newTicket, ...prev]);
      } else {
        console.error("Ticket creation failed:", newTicket.error);
      }
    } catch (err) {
      console.error("createTicket error:", err.message);
    }
  };

  const updateTicket = async (id, updatedFields) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedFields,
          user_id: user.user_id,
          department: user.department,
        }),
      });
      const updated = await res.json();
      setTickets((prev) =>
        prev.map((t) => (t.ticket_id === id ? updated : t))
      );
    } catch (err) {
      setError("Failed to update ticket.");
    }
  };

  useEffect(() => {
    if (user?.user_id) fetchTickets();
  }, [user]);

  return { tickets, createTicket, updateTicket, loading, error };
}