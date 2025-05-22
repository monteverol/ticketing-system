import TicketForm from "../TicketForm";
import DepartmentTicketList from "../DepartmentTicketList";
import MyTicketList from "../MyTicketList";
import { useAuth } from "../../context/AuthContext";
import { useTickets } from "../../hooks/useTickets";
import { useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { createTicket, tickets, updateTicket, loading, error } = useTickets(user.username);
  const [showSubmitTicketModal, setSubmitTicketModal] = useState(false);
  const [table, setTable] = useState("Department");

  return(
    <div className="col-span-4 p-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4 mb-4">
          <button
            className={`${table === "Department" ? "bg-blue-400 hover:bg-blue-500" : "bg-slate-400 hover:bg-slate-500"} px-4 py-2 font-bold text-xl text-white rounded-md cursor-pointer`}
            onClick={() => setTable("Department")}
          >
            Department
          </button>
          <button
            className={`${table !== "Department" ? "bg-blue-400 hover:bg-blue-500" : "bg-slate-400 hover:bg-slate-500"} px-4 py-2 font-bold text-xl bg-slate-400 hover:bg-slate-500 text-white rounded-md cursor-pointer`}
            onClick={() => setTable("SentTickets")}
          >
            Sent Tickets
          </button>
        </div>
        <button 
          className="bg-slate-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setSubmitTicketModal(true)}
        >
          Submit New Ticket
        </button>
      </div>
      <div className="">
        {
          table === "Department" ?
          <DepartmentTicketList department={user.department || "IT"} /> :
          <MyTicketList 
            tickets={tickets}
            updateTicket={updateTicket}
            loading={loading}
            error={error}
          />
        }
      </div>

      {/* MODALS */}
      {showSubmitTicketModal && <TicketForm onSubmit={createTicket} setSubmitTicketModal={setSubmitTicketModal} />}
    </div>
  );
}