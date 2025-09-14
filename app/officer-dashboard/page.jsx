"use client";

import { useEffect, useState } from "react";
import { FileText, Shield, Archive, LogOut } from "lucide-react";
import GuineaMap from "../../components/GuineaMap";

export default function OfficerDashboard() {
  useEffect(() => {
    const loggedIn = localStorage.getItem("isOfficerLoggedIn");
    if (!loggedIn) {
      window.location.href = "/officer-dashboard/login";
    }
  }, []);

  // Default Complaints
  const defaultComplaints = [
    { id: 1, description: "Street robbery reported in Karachi", status: "Pending" },
    { id: 2, description: "Car theft reported in Lahore", status: "Pending" },
    { id: 3, description: "House burglary reported in Islamabad", status: "Pending" },
  ];

  const [activeTab, setActiveTab] = useState("complaints");
  const [complaints, setComplaints] = useState([]);

  // Load complaints from localStorage or default
  useEffect(() => {
    const storedComplaints = localStorage.getItem("complaints");
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    } else {
      setComplaints(defaultComplaints);
      localStorage.setItem("complaints", JSON.stringify(defaultComplaints));
    }
  }, []);

  // Save complaints
  const saveComplaints = (updated) => {
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  // Actions
  const moveToInvestigation = (id) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: "Under Investigation" } : c
    );
    saveComplaints(updated);
  };

  const closeCase = (id) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: "Closed" } : c
    );
    saveComplaints(updated);
  };

  const deleteClosedCase = (id) => {
    const updated = complaints.filter((c) => c.id !== id);
    saveComplaints(updated);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("officer");
    window.location.href = "/officer/login";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Officer Dashboard</h1>
          <ul className="space-y-4">
            <li
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "complaints" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("complaints")}
            >
              <FileText size={18} /> Complaints
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "investigation" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("investigation")}
            >
              <Shield size={18} /> Under Investigation
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "closed" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("closed")}
            >
              <Archive size={18} /> Case Closed
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Complaints Section */}
        <br/>
        {activeTab === "complaints" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Pending Complaints</h2>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .filter((c) => c.status === "Pending")
                    .map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border flex gap-2">
                          <button
                            onClick={() => moveToInvestigation(complaint.id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Under Investigation
                          </button>
                          <button
                            onClick={() => closeCase(complaint.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Case Closed
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Under Investigation Section */}
        {activeTab === "investigation" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Under Investigation</h2>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .filter((c) => c.status === "Under Investigation")
                    .map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => closeCase(complaint.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Case Closed
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Case Closed Section */}
        {activeTab === "closed" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Closed Cases</h2>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .filter((c) => c.status === "Closed")
                    .map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => deleteClosedCase(complaint.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete Permanently
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
