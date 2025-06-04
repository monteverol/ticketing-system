import DepartmentTicketList from "../ui/lists/DepartmentTicketList";
import React from "react";
import { TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Settings, Calendar } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useTickets } from "../../hooks/useTickets";

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / 50));
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

const Progress = ({ value, className, color = "blue" }) => {
  const [animatedValue, setAnimatedValue] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };
  
  return (
    <div className={`bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden relative ${className}`}>
      <div 
        className={`h-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000 ease-out relative overflow-hidden`}
        style={{ width: `${animatedValue}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 shadow-2xl border border-white/20 backdrop-blur-sm bg-gradient-to-br ${gradient} group hover:scale-105 transition-all duration-300`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30`}>
          <Icon className={`h-6 w-6 text-white`} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-white/80 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-white/90 font-medium text-sm uppercase tracking-wide">{title}</h3>
        <div className="text-3xl font-bold text-white">
          <AnimatedCounter value={value} />
        </div>
        {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
      </div>
    </div>
    <div className="absolute -bottom-2 -right-2 opacity-10">
      <Icon className="h-16 w-16 text-white" />
    </div>
  </div>
);

const StatusBadge = ({ status, count }) => {
  const statusConfig = {
    pending: { color: 'from-amber-400 to-orange-500', icon: Clock, label: 'Pending' },
    viewed: { color: 'from-blue-400 to-blue-600', icon: Eye, label: 'Viewed' },
    processing: { color: 'from-purple-400 to-purple-600', icon: Settings, label: 'Processing' },
    resolved: { color: 'from-emerald-400 to-emerald-600', icon: CheckCircle, label: 'Resolved' },
    default: { color: 'from-gray-400 to-gray-600', icon: AlertCircle, label: 'Other' }
  };
  
  const config = statusConfig[status] || statusConfig.default;
  const Icon = config.icon;
  
  return (
    <div className="group flex items-center justify-between p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 transition-all duration-300 hover:scale-105 hover:drop-shadow-md">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} shadow-lg`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium text-gray-700 capitalize">{config.label}</span>
      </div>
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        {count}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const { departmentTickets, refetchDepartmentTickets, loading } = useTickets(user.username);

  // Calculate statistics
  const statusCounts = departmentTickets?.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const totalTickets = departmentTickets?.length || 0;
  const resolvedCount = statusCounts.resolved || 0;
  const pendingCount = statusCounts.pending || 0;
  const processingCount = statusCounts.processing || 0;
  const resolvedPercentage = totalTickets > 0 ? (resolvedCount / totalTickets * 100) : 0;
  const processingPercentage = totalTickets > 0 ? (processingCount / totalTickets * 100) : 0;

  // Recent activity data
  const recentTickets = departmentTickets?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-500 mt-2">Real-time ticket management insights</p>
            </div>
            <div className="flex items-center space-x-2 bg-black/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-black/20">
              <Calendar className="h-5 w-5 text-black/70" />
              <span className="text-black/90 font-medium">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Main Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tickets"
            value={totalTickets}
            icon={AlertCircle}
            gradient="from-blue-600 to-blue-800"
            trend="+12%"
            subtitle="All time"
          />
          
          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle}
            gradient="from-emerald-600 to-emerald-800"
            trend="+8%"
            subtitle={`${Math.round(resolvedPercentage)}% completion`}
          />
          
          <StatCard
            title="In Progress"
            value={processingCount}
            icon={Settings}
            gradient="from-purple-600 to-purple-800"
            trend="+5%"
            subtitle="Active tickets"
          />
          
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={Clock}
            gradient="from-orange-600 to-orange-800"
            trend="-3%"
            subtitle="Awaiting action"
          />
        </div>

        {/* Progress and Status Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resolution Progress */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-600 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-emerald-600" />
              Resolution Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Resolved Tickets</span>
                  <span>{Math.round(resolvedPercentage)}%</span>
                </div>
                <Progress value={resolvedPercentage} className="h-3" color="green" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>In Progress</span>
                  <span>{Math.round(processingPercentage)}%</span>
                </div>
                <Progress value={processingPercentage} className="h-3" color="purple" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-emerald-600">{resolvedCount}</div>
                <div className="text-sm text-gray-500">Resolved</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-purple-600">{processingCount}</div>
                <div className="text-sm text-gray-500">Processing</div>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-600 mb-6 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2 text-blue-600" />
              Status Overview
            </h3>
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <StatusBadge key={status} status={status} count={count} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <DepartmentTicketList
          departmentTickets={departmentTickets}
          refetchDepartmentTickets={refetchDepartmentTickets}
          loading={loading}
        />
      </div>
    </div>
  );
}