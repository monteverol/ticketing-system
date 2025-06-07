import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronRight, Building2 } from 'lucide-react';

const DepartmentTicketWidget = ({ department, tickets, onClick }) => {
  const statusColors = {
    'pending': '#f59e0b',
    'processing': '#8b5cf6',
    'resolved': '#10b981',
    'viewed': '#3b82f6',
    'rejected': '#ef4444'
  };

  const statusData = useMemo(() => {
    const statusCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  }, [tickets]);

  const totalTickets = tickets.length;

  return (
    <div 
      className="bg-gray-50/80 rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-slate-300"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{department}</h3>
            <p className="text-sm text-slate-600">{totalTickets} tickets</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-700">Status Distribution</span>
        <div className="flex items-center space-x-3">
          {statusData.map((item, index) => (
            <div key={item.status} className="flex items-center space-x-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: statusColors[item.status] }}
              ></div>
              <span className="text-xs text-slate-600 capitalize">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="count"
              nameKey="status"
              label={({ status, count, percent }) => `${count} (${(percent * 100).toFixed(1)}%)`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Tickets']}
              labelFormatter={(label) => label}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentTicketWidget;