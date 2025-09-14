"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, User, FileText, Shield, Archive } from "lucide-react";
import GuineaMap from "../../components/GuineaMap";

export default function PoliceDashboard() {
  useEffect(() => {
    const loggedIn = localStorage.getItem("commissioners");
    if (!loggedIn) {
      window.location.href = "/Commissaires-dashboard/login";
    }
  }, []);

  // Default data
  const defaultOfficers = [
    { id: 1, name: "Officer Ali", rank: "Inspector", badge: "PK-101", username: "ali101", password: "123456" },
    { id: 2, name: "Officer Ahmed", rank: "Sub-Inspector", badge: "PK-102", username: "ahmed102", password: "123456" },
  ];

  const defaultComplaints = [
    { id: 1, description: "Robbery at Market", status: "Pending" },
    { id: 2, description: "Car theft in street", status: "Pending" },
  ];

  const [activeTab, setActiveTab] = useState("officers");
  const [officers, setOfficers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [newOfficer, setNewOfficer] = useState({ name: "", rank: "", badge: "", username: "", password: "" });
  const [editingOfficer, setEditingOfficer] = useState(null);

  // Fetch complaints from database based on commissioner's station
  const fetchStationComplaints = async () => {
    try {
      const commissionerUsername = JSON.parse(localStorage.getItem("commissioners"));
      console.log(commissionerUsername.username);
      if (!commissionerUsername) return;

      const response = await fetch("/api/getcomplaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: commissionerUsername.username,
          userType: "commissioner"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error("Error fetching station complaints:", error);
    }
  };

  // LocalStorage load
  useEffect(() => {
    const storedOfficers = localStorage.getItem("officers");

    if (storedOfficers) {
      setOfficers(JSON.parse(storedOfficers));
    } else {
      setOfficers(defaultOfficers);
      localStorage.setItem("officers", JSON.stringify(defaultOfficers));
    }

    // Fetch complaints from database instead of localStorage
    fetchStationComplaints();
  }, []);

  // Save functions
  const saveOfficers = (updated) => {
    setOfficers(updated);
    localStorage.setItem("officers", JSON.stringify(updated));
  };

  const saveComplaints = (updated) => {
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  // Officer CRUD
  const addOfficer = async () => {
    if (!newOfficer.name || !newOfficer.rank || !newOfficer.badge || !newOfficer.username || !newOfficer.password) return;
    
    // Get commissioner username from localStorage
    const commissionerUsername = JSON.parse(localStorage.getItem("commissioners"));
    try {
      const res = await fetch("/api/police_agent/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...newOfficer, commissionerUsername: commissionerUsername.username}),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setNewOfficer({ name: "", rank: "", badge: "", username: "", password: "" });
        fetchOfficers(); // reload officers from DB
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const deleteOfficer = async (id) => {
    try {
      const res = await fetch(`/api/police_agent/officers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchOfficers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/police_agent/officers");
      const data = await res.json();
      setOfficers(data);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchOfficers();
  }, []);

  const editOfficer = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/police_agent/officers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchOfficers(); // refresh officers
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };
  // Complaint functions
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Commissaires Dashboard</h1>
        <ul className="space-y-4">
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "officers" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("officers")}
          >
            <User size={18} /> Officers
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "complaints" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            <FileText size={18} /> Complaints
          </li>
          <li
            className={`fl
              ex items-center gap-2 cursor-pointer ${activeTab === "investigation" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("investigation")}
          >
            <Shield size={18} /> Under Investigation
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "closed" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            <Archive size={18} /> Case Closed
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Officers Section */}
        {activeTab === "officers" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Manage Officers</h2>
            <div className="mb-6 bg-white shadow p-4 rounded-lg">
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Name"
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Rank"
                  value={newOfficer.rank}
                  onChange={(e) => setNewOfficer({ ...newOfficer, rank: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Badge No"
                  value={newOfficer.badge}
                  onChange={(e) => setNewOfficer({ ...newOfficer, badge: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newOfficer.username}
                  onChange={(e) => setNewOfficer({ ...newOfficer, username: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newOfficer.password}
                  onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                {editingOfficer ? (
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Edit size={16} /> Save
                  </button>
                ) : (
                  <button
                    onClick={addOfficer}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Plus size={16} /> Add
                  </button>
                )}
              </div>
            </div>

            {/* Officers Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Rank</th>
                    <th className="p-3 border">Badge</th>
                    <th className="p-3 border">Username</th>
                    <th className="p-3 border">Password</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-gray-100">
                      <td className="p-3 border">{officer.name}</td>
                      <td className="p-3 border">{officer.rank}</td>
                      <td className="p-3 border">{officer.badge}</td>
                      <td className="p-3 border">{officer.username}</td>
                      <td className="p-3 border">{officer.password}</td>
                      <td className="p-3 border flex gap-2">
                        <button
                          onClick={() => startEdit(officer)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => deleteOfficer(officer.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />

            {/* Map Section */}
            <div className="mt-6 bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4">Police Map</h3>
              <GuineaMap />
            </div>
          </>
        )}

        {/* Complaints Section */}
        {activeTab === "complaints" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Station Complaints</h2>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Case ID</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .filter((c) => c.status === "Pending")
                    .map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.complaintId}</td>
                        <td className="p-3 border">{complaint.name}</td>
                        <td className="p-3 border">{complaint.title}</td>
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">{complaint.submissionDate}</td>
                        <td className="p-3 border flex gap-2">
                          <button
                            onClick={() => moveToInvestigation(complaint._id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Under Investigation
                          </button>
                          <button
                            onClick={() => closeCase(complaint._id)}
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
                    <th className="p-3 border">Case ID</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .filter((c) => c.status === "Under Investigation")
                    .map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.complaintId}</td>
                        <td className="p-3 border">{complaint.name}</td>
                        <td className="p-3 border">{complaint.title}</td>
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">{complaint.submissionDate}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => closeCase(complaint._id)}
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
            <h2 className="text-2xl font-bold mb-6">Case Closed</h2>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Case ID</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints
                    .filter((c) => c.status === "Closed")
                    .map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.complaintId}</td>
                        <td className="p-3 border">{complaint.name}</td>
                        <td className="p-3 border">{complaint.title}</td>
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">{complaint.submissionDate}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => deleteClosedCase(complaint._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
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
