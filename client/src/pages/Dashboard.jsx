import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TicketForm from "../components/TicketForm";
import MyTicketList from "../components/MyTicketList";
import { useTickets } from "../hooks/useTickets";
import DepartmentTicketList from "../components/DepartmentTicketList";
import AdminTicketList from "../components/AdminTicketList"
import AdminAnalytics from "../components/AdminAnalytics";
import ManagerApprovalList from "../components/ManagerApprovalList";
import EmployeeDashboard from "../components/employee/EmployeeDashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { createTicket } = useTickets(user.username);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="grid grid-cols-5">
      <div className="h-screen sticky top-0 p-6 flex flex-col items-center justify-between border-r">
        <div className="flex flex-col gap-2 items-start w-full">
          <h1 className="text-lg">Name: <span className="font-bold">{user.username}</span></h1>
          <h1 className="text-lg">Department: <span className="font-bold">{user.department}</span></h1>
          <h1 className="text-lg">Role: <span className="font-bold">{user.role}</span></h1>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-slate-400 hover:bg-slate-600 py-2 rounded-lg font-bold cursor-pointer text-white"
        >
          Logout
        </button>
      </div>

      {user.role === "employee" && (
        <EmployeeDashboard />
      )}

      {user.role === "manager" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Department Tickets</h2>
          <p className="text-gray-600">Review all tickets submitted by your department.</p>
          {/* DepartmentTicketList component goes here */}
          <ManagerApprovalList />
          <DepartmentTicketList department={user.department || "IT"} />
        </div>
      )}

      {user.role === "admin" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
          <p className="text-gray-600">View all submitted tickets and manage users.</p>
          {/* AdminTicketList and UserManagement components go here */}
          {/* <AdminAnalytics /> */}
          <AdminTicketList />
        </div>
      )}
    </div>
  );
}
