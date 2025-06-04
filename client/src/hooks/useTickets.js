import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5002/api/tickets";

export function useTickets() {
  const { user } = useAuth(); // ✅ to access department
  const [tickets, setTickets] = useState([]);
  const [departmentTickets, setDepartmentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}?user_id=${user.user_id}`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError("Failed to load tickets.");
      toast.error("Failed to load tickets.")
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentTickets = useCallback(async () => {
    if (!user?.department) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/department/${user.department}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDepartmentTickets(data);
    } catch (err) {
      console.error("Failed to load department tickets:", err);
      setError("Could not load department tickets.");
      toast.error("Could not load department tickets");
    } finally {
      setLoading(false);
    }
  }, [user?.department]);

  const createTicket = async (payload) => {
    try {
      const isFormData = payload instanceof FormData;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: isFormData 
        ? {} // let the browser set the Content-Type boundary for multipart
        : { "Content-Type": "application/json" },
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
      toast.success("Ticket updated");
    } catch (err) {
      setError("Failed to update ticket.");
      toast.error("Failed to update ticket");
    }
  };

  // Only fetch *once* when user.department becomes available
  useEffect(() => {
    if (user?.user_id) {
      fetchTickets();
      fetchDepartmentTickets();
    }
  }, [user, fetchDepartmentTickets]);

  // expose this inside return
  return {
    tickets,
    departmentTickets,
    createTicket,
    updateTicket,
    loading,
    error,
    refetchDepartmentTickets: fetchDepartmentTickets, // ✅ add this
  };
}