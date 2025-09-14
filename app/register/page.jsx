"use client";
import { useState } from "react";
import Header from "../../components/header";

export default function Register() {
  const [formData, setFormData] = useState({
    role: "user",
    fullName: "",
    phone: "",
    email: "",
    username: "",
    cnic: "",
    city: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Client-side validation
      if (formData.password !== formData.confirmPassword) {
        setMessage({ text: "Passwords do not match!", type: "error" });
        setLoading(false);
        return;
      }

      // API call to backend
      const response = await fetch("/api/dashboard/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: "Registration successful! Redirecting...",
          type: "success",
        });

        // Save user city to localStorage for complaint form
        if (formData.role === "user" && formData.city) {
          localStorage.setItem("userCity", formData.city);
        }

        // Reset form
        setFormData({
          role: "user",
          fullName: "",
          phone: "",
          email: "",
          username: "",
          cnic: "",
          city: "",
          address: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect after success
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);

      } else {
        setMessage({
          text: data.message || "Registration failed. Please try again.",
          type: "error",
        });
      }

    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        text: "Network error. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <br />
      <br />
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 drop-shadow-md mb-6">
            Registration
          </h2>

          {/* message */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Role */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="user">User</option>
                <option value="anonymous">Anonymous</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {formData.role === "anonymous" ? (
              <>
                {/* Username */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CNIC
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="XXXXX-XXXXXXX-X"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}