"use client"

import { useState, useEffect } from "react";
import { DashboardHeader } from "../../components/DashboardHeader";

const ComplaintForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [policeStations, setPoliceStations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cnic: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    evidence: null,
    policeStation: "",
  });

  // Fetch police stations based on user's city
  const fetchPoliceStations = async (city) => {
    try {
      const response = await fetch("/api/addstation");
      if (response.ok) {
        const data = await response.json();
        // Filter stations by user's city
        const cityStations = data.filter(station => 
          station.city.toLowerCase() === city.toLowerCase()
        );
        setPoliceStations(cityStations);
      }
    } catch (error) {
      console.error("Error fetching police stations:", error);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("isUserLoggedIn");
    if (currentUser) {
      setIsAuthenticated(true);
      
      // Get user's city from localStorage and fetch police stations
      const userCity = localStorage.getItem("userCity");
      if (userCity) {
        fetchPoliceStations(userCity);
      }
      
      // Pre-fill form with user data if available
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setForm(prevForm => ({
          ...prevForm,
          name: user.fullName || prevForm.name,
          cnic: user.cnic || prevForm.cnic,
          phone: user.phone || prevForm.phone,
          address: user.address || prevForm.address,
        }));
      }
    } else {
      window.location.href = "/login";
    }
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    // Basic validation for required fields
    if (
      !form.name ||
      !form.cnic ||
      !form.phone ||
      !form.address ||
      !form.title ||
      !form.description ||
      !form.policeStation
    ) {
      setMessage({
        text: "❌ Please fill out all required fields!",
        type: "error",
      });
      setIsSubmitting(false);
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return;
    }

    try {
      // Prepare data for API call
      const complaintData = {
        name: form.name,
        cnic: form.cnic,
        phone: form.phone,
        address: form.address,
        title: form.title,
        description: form.description,
        evidence: form.evidence ? form.evidence.name : null,
        policeStation: form.policeStation,
      };

      // API call to backend
      const response = await fetch("/api/compalint-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          text: `✅ Complaint submitted successfully! Your case ID is: ${data.complaintId}`, 
          type: "success" 
        });

        // Reset form
        setForm({
          name: "",
          cnic: "",
          phone: "",
          address: "",
          title: "",
          description: "",
          evidence: null,
          policeStation: "",
        });

        // Clear file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }

        // Redirect after success
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 3000);

      } else {
        setMessage({
          text: `❌ ${data.message || 'Failed to submit complaint. Please try again.'}`,
          type: "error",
        });
      }

    } catch (error) {
      console.error("Complaint submission error:", error);
      setMessage({
        text: "❌ Network error. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <DashboardHeader />
      <br />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-xl p-8 
                        shadow-[0_4px_20px_rgba(37,99,235,0.3)]">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Submit a Complaint
          </h2>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              />
            </div>

            {/* CNIC */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                CNIC / ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cnic"
                value={form.cnic}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="XXXXX-XXXXXXX-X"
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="+92-XXX-XXXXXXX"
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              />
            </div>

            {/* Police Station */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Police Station <span className="text-red-500">*</span>
              </label>
              <select
                name="policeStation"
                value={form.policeStation}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              >
                <option value="">Select Police Station</option>
                {policeStations.map((station) => (
                  <option key={station._id} value={station.name}>
                    {station.name} - {station.city}
                  </option>
                ))}
              </select>
              {policeStations.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No police stations found for your city. Please contact admin.
                </p>
              )}
            </div>

            {/* Complaint Title */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Brief description of your complaint"
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              />
            </div>

            {/* Complaint Description */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={isSubmitting}
                rows="4"
                placeholder="Please provide detailed information about your complaint..."
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                required
              ></textarea>
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block font-semibold text-blue-600 mb-1">
                Upload Evidence (optional)
              </label>
              <input
                type="file"
                name="evidence"
                onChange={handleChange}
                disabled={isSubmitting}
                accept="image/*,video/*,.pdf,.doc,.docx"
                className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-blue-50 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: Images, Videos, PDF, Word documents
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ComplaintForm;