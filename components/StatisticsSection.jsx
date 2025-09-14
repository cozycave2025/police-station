"use client"

import { TrendingUp, Users, MapPin, Clock } from "lucide-react"

const StatisticsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      title: "Total Complaints Filed",
      value: "12,847",
      change: "+15% this month",
      color: "text-blue-500",
    },
    {
      icon: Clock,
      title: "Resolution Rate",
      value: "87.3%",
      change: "+3% improvement",
      color: "text-blue-400",
    },
    {
      icon: MapPin,
      title: "Police Stations Connected",
      value: "247",
      change: "Across 12 districts",
      color: "text-purple-400",
    },
    {
      icon: Users,
      title: "Active Cases",
      value: "1,632",
      change: "Under investigation",
      color: "text-blue-400",
    },
  ]

  return (
    <section id="statistics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2  className="text-3xl md:text-4xl font-bold text-blue-600 
            drop-shadow-[0_0_10px_#3b82f6]">
            System Performance & Impact
          </h2>
          <br />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time statistics showing the effectiveness and reach of our complaint management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-blue-200 rounded-xl p-6 text-center shadow-lg hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <stat.icon className="h-6 w-6 text-blue-500" />
              </div>

              {/* Value */}
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
              <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cases Resolved */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Cases Resolved This Month
              </span>
              <span className="text-sm font-bold text-blue-500">94%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "94%" }}></div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Average Response Time
              </span>
              <span className="text-sm font-bold text-green-400">2.4 hrs</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>

          {/* User Satisfaction */}
          <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                User Satisfaction
              </span>
              <span className="text-sm font-bold text-blue-400">4.8/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" style={{ width: "96%" }}></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Statistics updated in real-time • Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  )
}

export default StatisticsSection
