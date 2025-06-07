import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import useSocket from "./useSocket";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
const TICKETS_API = `${BASE_URL}/api/tickets`;

export function useTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [departmentTickets, setDepartmentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Realtime socket updates
  useSocket(
    (newTicket) => {
      if (newTicket.responding_department === user?.department) {
        setDepartmentTickets((prev) => [newTicket, ...prev]);
      }
      if (newTicket.user_id === user?.user_id) {
        setTickets((prev) => [newTicket, ...prev]);
      }
    },
    (updatedTicket) => {
      if (updatedTicket.responding_department === user?.department) {
        setDepartmentTickets((prev) =>
          prev.map((t) => (t.ticket_id === updatedTicket.ticket_id ? updatedTicket : t))
        );
      }
      if (updatedTicket.user_id === user?.user_id) {
        setTickets((prev) =>
          prev.map((t) => (t.ticket_id === updatedTicket.ticket_id ? updatedTicket : t))
        );
      }
    }
  );

  // ✅ Fetch user tickets
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${TICKETS_API}?user_id=${user.user_id}`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError("Failed to load tickets.");
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch department tickets
  const fetchDepartmentTickets = useCallback(async () => {
    if (!user?.department) return;
    setLoading(true);
    try {
      const res = await fetch(`${TICKETS_API}/department/${user.department}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDepartmentTickets(data);
    } catch (err) {
      console.error("Failed to load department tickets:", err);
      setError("Could not load department tickets.");
      toast.error("Could not load department tickets.");
    } finally {
      setLoading(false);
    }
  }, [user?.department]);

  // ✅ Create a new ticket
  const createTicket = async (payload) => {
    try {
      const isFormData = payload instanceof FormData;
      const res = await fetch(TICKETS_API, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const newTicket = await res.json();
      if (res.ok) {
        setTickets((prev) => [newTicket, ...prev]);
        toast.success("Ticket created");
      } else {
        console.error("Ticket creation failed:", newTicket.error);
        toast.error("Ticket creation failed");
      }
    } catch (err) {
      console.error("createTicket error:", err);
      toast.error("Ticket creation failed");
    }
  };

  // ✅ Update ticket (generic)
  const updateTicket = async (id, updatedFields) => {
    try {
      const res = await fetch(`${TICKETS_API}/${id}`, {
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
      toast.success("Ticket updated");
    } catch (err) {
      setError("Failed to update ticket.");
      toast.error("Failed to update ticket");
    }
  };

  // ✅ View a ticket (mark as viewed)
  const viewTicket = async (ticket) => {
    if (ticket.status === "pending") {
      const res = await fetch(`${TICKETS_API}/${ticket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          responding_department: user.department,
          purpose: ticket.purpose,
          description: ticket.description,
          status: "viewed",
          remarks: ticket.remarks || "",
        }),
      });
      if (res.ok) {
        await fetchDepartmentTickets(); // refresh after viewing
      }
    }
  };

  // ✅ Save ticket (admin/manager update + modal closing)
  const saveTicket = async (id, updates, selectedTicket, onComplete) => {
    const updatePromise = async () => {
      const response = await fetch(`${TICKETS_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          user_id: user.user_id,
          responding_department: user.department,
          purpose: selectedTicket.purpose,
          description: selectedTicket.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update ticket");
      }

      await fetchDepartmentTickets(); // Refresh state
      if (onComplete) onComplete();   // Close modal or do other cleanup
      return response;
    };

    toast.promise(updatePromise(), {
      loading: "Saving ticket...",
      success: "Ticket saved successfully!",
      error: (err) => `Save failed: ${err.message}`,
    });
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchTickets();
      fetchDepartmentTickets();
    }
  }, [user, fetchDepartmentTickets]);

  return {
    tickets,
    departmentTickets,
    createTicket,
    updateTicket,
    viewTicket,
    saveTicket,
    loading,
    error,
    refetchDepartmentTickets: fetchDepartmentTickets,
  };
}
