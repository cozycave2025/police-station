"use client"

import { Lock, FileText, Search, BarChart3, Bell, Users } from "lucide-react"

const FeaturesSection = () => {
  const features = [
    {
      icon: Lock,
      title: "Secure & Confidential",
      description:
        "End-to-end encryption ensures your personal information and case details remain completely confidential and protected.",
    },
    {
      icon: FileText,
      title: "Online Complaint Filing",
      description:
        "File complaints 24/7 from anywhere with our user-friendly online form. No need to visit police stations initially.",
    },
    {
      icon: Search,
      title: "Police Case Tracking",
      description:
        "Real-time updates on your case status, assigned officers, and investigation progress through our secure portal.",
    },
    {
      icon: BarChart3,
      title: "Statistics & Reports",
      description:
        "Access comprehensive analytics and reports to understand case trends and system performance transparently.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Receive instant alerts via SMS and email for case updates, hearings, and important procedural developments.",
    },
    {
      icon: Users,
      title: "User-Friendly Experience",
      description:
        "Our platform is designed to be simple, intuitive, and accessible for everyone regardless of technical skills.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-blue-600 
            drop-shadow-[0_0_10px_#3b82f6]"
          >
            Features & Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Built with the latest security standards and user experience best practices
            for sensitive case management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-blue-200 rounded-2xl 
              shadow-md hover:shadow-[0_0_15px_#3b82f6] transition-all duration-300 p-6 text-center"
            >
              {/* Icon */}
              <div className="mx-auto w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center 
              group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-7 w-7 text-blue-500 group-hover:text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-blue-600 mt-4 drop-shadow-[0_0_6px_#3b82f6]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Highlight */}
        <div
          className="mt-16 bg-white border border-blue-200 rounded-2xl 
          shadow-[0_0_15px_#3b82f6] p-8 text-center"
        >
          <Lock className="h-10 w-10 text-blue-600 mx-auto mb-4 drop-shadow-[0_0_8px_#3b82f6]" />
          <h3 className="text-lg font-bold text-blue-600 mb-3 drop-shadow-[0_0_6px_#3b82f6]">
            Government-Grade Security
          </h3>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Our platform meets the highest security standards with ISO 27001 compliance,
            regular security audits, and data protection protocols approved by law
            enforcement agencies.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
