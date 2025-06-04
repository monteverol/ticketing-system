import DepartmentTicketList from "../ui/lists/DepartmentTicketList";
import React from "react";
import { TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Settings, Calendar } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useTickets } from "../../hooks/useTickets";
import Progress from "../ui/widgets/Progress";
import StatCard from "../ui/widgets/StatCard";
import StatusBadge from "../ui/widgets/StatusBadge";

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
  const processingPercentage = totalTickets > 0 ? (processingCount / (totalTickets - resolvedCount) * 100) : 0;

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
            trend="-"
            subtitle="All time"
          />
          
          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle}
            gradient="from-emerald-600 to-emerald-800"
            trend="-"
            subtitle={`${Math.round(resolvedPercentage)}% completion`}
          />
          
          <StatCard
            title="In Progress"
            value={processingCount}
            icon={Settings}
            gradient="from-purple-600 to-purple-800"
            trend="-"
            subtitle="Active tickets"
          />
          
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={Clock}
            gradient="from-orange-600 to-orange-800"
            trend="-"
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