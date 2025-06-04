// import { useEffect, useState } from "react";

// export default function AnalyticsDashboard() {
//   const [data, setData] = useState(null);

  // useEffect(() => {
  //   fetch("http://localhost:5002/api/tickets/analytics")
  //     .then((res) => res.json())
  //     .then(setData)
  //     .catch(() => alert("Failed to fetch analytics"));
  // }, []);

//   if (!data) return <p>Loading analytics...</p>;

//   return (
//     <div className="p-4 bg-white rounded shadow space-y-2">
//       <h2 className="text-xl font-bold">Ticket Analytics</h2>
//       <p>Total Tickets: <strong>{data.total}</strong></p>

//       <div>
//         <h3 className="font-semibold">By Status:</h3>
//         <ul className="list-disc pl-5">
//           {data.status.map((s) => (
//             <li key={s.status}>{s.status}: {s.count}</li>
//           ))}
//         </ul>
//       </div>

//       <div>
//         <h3 className="font-semibold">By Department:</h3>
//         <ul className="list-disc pl-5">
//           {data.department.map((d) => (
//             <li key={d.department}>{d.department}: {d.count}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { Activity, Users, AlertCircle, CheckCircle, Clock, TrendingUp, Filter, Download, RefreshCw } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetch("http://localhost:5002/api/tickets/analytics")
      .then((res) => res.json())
      .then(setData)
      .catch(() => alert("Failed to fetch analytics"));
    setLoading(false);
  }, []);

  // const fetchData = async () => {
  //   try {
  //     setRefreshing(true);
  //     // Simulating API call with mock data for demonstration
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     const mockData = {
  //       total: 1247,
  //       status: [
  //         { status: 'Open', count: 342, color: '#ef4444' },
  //         { status: 'In Progress', count: 189, color: '#f59e0b' },
  //         { status: 'Resolved', count: 624, color: '#10b981' },
  //         { status: 'Closed', count: 92, color: '#6b7280' }
  //       ],
  //       department: [
  //         { department: 'IT Support', count: 456, staff: 12 },
  //         { department: 'HR', count: 234, staff: 8 },
  //         { department: 'Finance', count: 189, staff: 6 },
  //         { department: 'Operations', count: 156, staff: 10 },
  //         { department: 'Marketing', count: 134, staff: 7 },
  //         { department: 'Sales', count: 78, staff: 9 }
  //       ],
  //       trends: [
  //         { month: 'Jan', tickets: 98, resolved: 89 },
  //         { month: 'Feb', tickets: 132, resolved: 118 },
  //         { month: 'Mar', tickets: 156, resolved: 145 },
  //         { month: 'Apr', tickets: 189, resolved: 167 },
  //         { month: 'May', tickets: 167, resolved: 156 },
  //         { month: 'Jun', tickets: 145, resolved: 134 }
  //       ],
  //       metrics: {
  //         avgResolutionTime: '2.3 hours',
  //         satisfactionRate: '94.2%',
  //         activeStaff: 52,
  //         totalStaff: 58
  //       }
  //     };
      
  //     setData(mockData);
  //   } catch (error) {
  //     alert("Failed to fetch analytics");
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-lg text-slate-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statusColors = ['#ef4444', '#f59e0b', '#10b981', '#6b7280'];

  console.log(data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Monitor ticket performance and department insights</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
              <option value="today">Today</option>
            </select>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tickets</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{data.total.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↗ +12% from last month</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Staff</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{data.metrics.activeStaff}/{data.metrics.totalStaff}</p>
                <p className="text-sm text-slate-500 mt-1">Staff utilization</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Resolution</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{data.metrics.avgResolutionTime}</p>
                <p className="text-sm text-green-600 mt-1">↘ -15% improvement</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Satisfaction Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{data.metrics.satisfactionRate}</p>
                <p className="text-sm text-green-600 mt-1">↗ +2.1% from last month</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Ticket Status Distribution</h3>
              <div className="flex items-center space-x-4">
                {data.status.map((item, index) => (
                  <div key={item.status} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: statusColors[index] }}
                    ></div>
                    <span className="text-sm text-slate-600">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.status}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count, percent }) => `${status}: ${count} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {data.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[index]} />
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

          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Ticket Trends (6 Months)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="tickets" 
                    stackId="1"
                    stroke="#6366f1" 
                    fill="#6366f1" 
                    fillOpacity={0.6}
                    name="Total Tickets"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Department Performance</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.department} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="department" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {data.department.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-md font-medium text-slate-700">Department Details</h4>
              {data.department.map((dept, index) => (
                <div key={dept.department} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                    ></div>
                    <div>
                      <p className="font-medium text-slate-900">{dept.department}</p>
                      <p className="text-sm text-slate-500">{dept.staff} staff members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{dept.count}</p>
                    <p className="text-sm text-slate-500">tickets</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.status.map((status, index) => (
            <div key={status.status} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{status.status} Tickets</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{status.count}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {((status.count / data.total) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${statusColors[index]}20` }}
                >
                  {status.status === 'Open' && <AlertCircle className="w-6 h-6" style={{ color: statusColors[index] }} />}
                  {status.status === 'In Progress' && <Clock className="w-6 h-6" style={{ color: statusColors[index] }} />}
                  {status.status === 'Resolved' && <CheckCircle className="w-6 h-6" style={{ color: statusColors[index] }} />}
                  {status.status === 'Closed' && <CheckCircle className="w-6 h-6" style={{ color: statusColors[index] }} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}