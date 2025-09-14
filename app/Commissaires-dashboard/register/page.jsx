"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirm: "",
    city: "",
    policeStation: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const res = await fetch("/api/Commissaires/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        router.push("/Commissaires-dashboard/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">commissioners Register</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-2 border rounded"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="p-2 border rounded"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="p-2 border rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="p-2 border rounded"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="City"
            className="p-2 border rounded"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Police Station"
            className="p-2 border rounded"
            value={form.policeStation}
            onChange={(e) => setForm({ ...form, policeStation: e.target.value })}
            required
          />
        </div>

        <button className="mt-6 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
}
