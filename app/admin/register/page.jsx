"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    adminId: "",
    designation: "",
    city: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirm) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          adminId: form.adminId,
          designation: form.designation,
          city: form.city,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registered successfully! Please login.");
        router.push("/admin/login");
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Failed to connect to the server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Register</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Admin ID"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.adminId}
            onChange={(e) => setForm({ ...form, adminId: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Designation"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="City"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full p-2 rounded text-white ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}