import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useDepartments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/tickets/department/${user.department}`);
      const data = res.json();
      setDepartments(data);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.user_id) fetchDepartments();
  }, [user]);

  return { departments, loading, error };
}