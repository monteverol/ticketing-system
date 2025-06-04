import { useEffect, useState } from "react";

const Progress = ({ value, className, color = "blue" }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
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

export default Progress;