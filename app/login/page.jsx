"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "user",
    identifier: "", // email/phone for user, username for anonymous
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role);
        
        setMessage({
          text: "Login successful! Redirecting...",
          type: "success",
        });

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "anonymous") {
            router.push("/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1500);

      } else {
        setMessage({
          text: data.message || "Login failed. Please check your credentials.",
          type: "error",
        });
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        text: "Network error. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          User Login
        </h2>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login as
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

          {/* Identifier Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.role === "anonymous" ? "Username" : "Email or Phone"}
            </label>
            <input
              type="text"
              name="identifier"
              placeholder={
                formData.role === "anonymous" 
                  ? "Enter your username" 
                  : "Enter email or phone number"
              }
              value={formData.identifier}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}