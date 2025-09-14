"use client"
import { FileText, Search, Bell, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: FileText,
      title: "File Complaint",
      description:
        "Submit your complaint securely with complete confidentiality and anonymity protection.",
    },
    {
      icon: Search,
      title: "Police Review",
      description:
        "Assigned officers review your case and begin the investigation process immediately.",
    },
    {
      icon: Bell,
      title: "Case Updates",
      description:
        "Receive real-time notifications about your case progress and important developments.",
    },
    {
      icon: CheckCircle,
      title: "Resolution",
      description:
        "Track your case to completion with full transparency and justice delivery.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-blue-600 
            drop-shadow-[0_0_10px_#3b82f6]"
          >
            How Our System Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            A simple, secure, and transparent process designed to ensure justice
            and protect your privacy.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-blue-200 rounded-2xl p-6 
              shadow-md hover:shadow-[0_0_15px_#3b82f6] transition"
            >
              {/* Icon with step number */}
              <div className="relative mb-6 flex items-center justify-center">
                <div className="relative z-10 mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-[0_0_10px_#3b82f6]">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold border border-blue-300">
                  {index + 1}
                </div>
              </div>

              {/* Title & description */}
              <h3 className="text-xl font-semibold text-blue-600 mb-3 drop-shadow-[0_0_6px_#3b82f6]">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-700 border border-blue-200 bg-white px-6 py-3 rounded-lg inline-block shadow hover:shadow-[0_0_12px_#3b82f6] transition">
            <span className="font-semibold text-blue-600">
              Average Resolution Time:
            </span>{" "}
            7-14 business days
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
