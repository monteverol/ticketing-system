// hooks/useNotifications.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetch('/api/notifications', {
      headers:{ Authorization: `Bearer ${token}` }
    })
      .then(r=>r.json())
      .then(setNotes);
  }, [token]);
  return notes;
}
