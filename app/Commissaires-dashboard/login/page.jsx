"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/Commissaires/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        localStorage.setItem("commissioners", JSON.stringify(form));
        router.push("/Commissaires-dashboard");
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Commissioners Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
        <br /><br />
        <center>

        <a className="text-blue-600 hover:text-blue-900 transition"  href="/Commissaires-dashboard/register">Register now</a>
        </center>
      </form>
    </div>
  );
}
