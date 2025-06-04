import AnimatedCounter from "./AnimatedCounter";
import { TrendingUp } from 'lucide-react';

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

export default StatCard;