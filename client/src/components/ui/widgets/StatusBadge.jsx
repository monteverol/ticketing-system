import { Clock, CheckCircle, AlertCircle, Eye, Settings } from 'lucide-react';

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

export default StatusBadge;