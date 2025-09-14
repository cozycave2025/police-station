import { FileText, Users, TrendingUp, AlertTriangle } from "lucide-react";


export const StatCard = ({ title, value, subtitle, icon: Icon, trend, className = "" }) => {
    return (
      <div
        className={`bg-black border border-orange-500/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-orange-500/20 transition ${className}`}
      >
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.value}
          </span>
        </div>
  
        {/* Stats */}
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
    );
  }; 