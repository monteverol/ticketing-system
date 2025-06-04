import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { 
  LogOut, Home, Ticket, Users, Settings, Bell, HelpCircle, 
  Shield, UserCheck, ListChecks, BarChart2, X
} from "lucide-react";
import TicketForm from "../components/ui/tickets/TicketForm";
import { toast } from "react-hot-toast";

export default function MainWrapper() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [submitTicketModal, setSubmitTicketModal] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);

  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentTab = pathSegments[pathSegments.length - 1] || 'dashboard';
    setActiveTab(currentTab);
  }, [location]);

  // NavItem component (updated navigation)
  const NavItem = ({ icon: Icon, label, value, path }) => (
    <div
      onClick={() => navigate(path || value)}
      className={`flex items-center gap-3 p-3 rounded-r-lg cursor-pointer transition-all ${
        activeTab === value 
          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
          : 'hover:bg-gray-50 text-gray-600'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );

  // getNavItems (simplified paths)
  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", value: "dashboard", path: "" },
      { icon: Ticket, label: "My Tickets", value: "tickets", path: "tickets" },
      { icon: HelpCircle, label: "Help", value: "help", path: "help" },
    ];

    if (user?.role === "manager") {
      return [
        ...baseItems,
        { icon: UserCheck, label: "Approvals", value: "approvals", path: "approvals" },
        { icon: ListChecks, label: "Team Tickets", value: "team-tickets", path: "team-tickets" },
        { icon: Users, label: "Team Overview", value: "team", path: "team" },
      ];
    }

    if (user?.role === "admin") {
      return [
        ...baseItems,
        { icon: Shield, label: "Admin Console", value: "admin", path: "admin" },
        { icon: Users, label: "User Management", value: "users", path: "users" },
        { icon: BarChart2, label: "Analytics", value: "analytics", path: "analytics" },
      ];
    }

    return baseItems;
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white p-4 shadow-sm z-10">
        <div className="flex items-center gap-3 mb-8 p-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>

        <button
          className="text-gray-600 flex flex-row items-center gap-3 p-3 font-bold bg-blue-200 hover:bg-blue-400 group hover:text-blue-50 rounded-md mb-4"
          onClick={() => setSubmitTicketModal(true)}
        >
          <Ticket size={20} className="text-gray-500 group-hover:text-blue-50" />
          Submit Ticket
        </button>

        <nav className="space-y-1 flex-1">
          {getNavItems().map(item => (
            <NavItem key={item.value} {...item} />
          ))}
        </nav>

        <div className="mt-auto space-y-1">
          <NavItem icon={Settings} label="Settings" value="settings" />
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-600 bg-red-50 group hover:bg-red-100 hover:text-red-600 transition-all"
          >
            <LogOut size={20} className="text-gray-500 group-hover:text-red-500" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </div>
      </div>

      {/* MODALS */}
      {submitTicketModal && <TicketForm setSubmitTicketModal={setSubmitTicketModal} />}
    </div>
  );
}