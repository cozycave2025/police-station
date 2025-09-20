"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OfficerLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to your backend
      const response = await fetch("/api/police_agent/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication token or user info in localStorage
        localStorage.setItem("isOfficerLoggedIn", "true");
        localStorage.setItem("officerData", JSON.stringify(data.officer));
        
        router.push("/officer-dashboard");
      } else {
        alert(data.message || "Identifiants de l'agent invalides !");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Connexion Agent</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          className="w-full mb-4 p-2 border rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-6 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          disabled={loading}
        />
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}