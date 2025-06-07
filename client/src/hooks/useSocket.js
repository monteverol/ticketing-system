import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

export default function useSocket(onNewTicket, onTicketUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BASE_URL);

    if (onNewTicket) {
      socketRef.current.on("new-ticket", onNewTicket);
    }

    if (onTicketUpdate) {
      socketRef.current.on("ticket-updated", onTicketUpdate);
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [onNewTicket, onTicketUpdate]);

  return socketRef.current;
}