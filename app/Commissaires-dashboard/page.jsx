"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, User, FileText, Shield, Archive, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PoliceDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("commissioners");
    if (!loggedIn) {
      window.location.href = "/Commissaires-dashboard/login";
    }
    setIsLoading(false);
  }, []);

  // Default data

  const defaultComplaints = [
    { id: 1, description: "Robbery at Market", status: "Pending" },
    { id: 2, description: "Car theft in street", status: "Pending" },
  ];

  const [activeTab, setActiveTab] = useState("officers");
  const [officers, setOfficers] = useState([]);
  const [officersLoading, setOfficersLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [newOfficer, setNewOfficer] = useState({ name: "", rank: "", badge: "", username: "", password: "" });
  const [editingOfficer, setEditingOfficer] = useState(null);

  // Fetch complaints from database based on commissioner's station
  const fetchStationComplaints = async () => {
    setComplaintsLoading(true);
    try {
      const commissionerUsername = JSON.parse(localStorage.getItem("commissioners"));
      console.log(commissionerUsername?.[0]?.username);
      if (!commissionerUsername || !commissionerUsername[0]) return;

      const response = await fetch("/api/getcomplaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: commissionerUsername[0].username,
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
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    // Fetch complaints and officers from database on mount
    fetchStationComplaints();
    fetchOfficers();
  }, []);

  // Save functions (not using localStorage anymore)
  const saveOfficers = (updated) => {
    setOfficers(updated);
  };

  const saveComplaints = (updated) => {
    setComplaints(updated);
  };

  // Officer CRUD
  const addOfficer = async () => {
    if (!newOfficer.name || !newOfficer.rank || !newOfficer.badge || !newOfficer.username || !newOfficer.password) return;
    
    // Get commissioner username from localStorage
    const commissionerUsername = JSON.parse(localStorage.getItem("commissioners"));
    if (!commissionerUsername || !commissionerUsername[0]) {
      alert("Commissioner data not found!");
      return;
    }
    try {
      const res = await fetch("/api/police_agent/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...newOfficer, commissionerUsername: commissionerUsername[0].username}),
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
      setOfficersLoading(true);
      const res = await fetch("/api/police_agent/officers");
      const data = await res.json();
      setOfficers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOfficers([]);
    } finally {
      setOfficersLoading(false);
    }
  };

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

  const startEdit = (officer) => {
    setEditingOfficer(officer);
    setNewOfficer({
      name: officer.name,
      rank: officer.rank,
      badge: officer.badge,
      username: officer.username,
      password: officer.password
    });
  };

  const saveEdit = async () => {
    if (!editingOfficer) return;
    await editOfficer(editingOfficer.id, newOfficer);
    setEditingOfficer(null);
    setNewOfficer({ name: "", rank: "", badge: "", username: "", password: "" });
  };
  // Complaint functions - Database integration
  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const response = await fetch('/api/complaints/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: newStatus
        }),
      });

      if (response.ok) {
        // Refresh complaints after update
        fetchStationComplaints();
        alert(`Complaint status updated to ${newStatus}`);
      } else {
        const error = await response.json();
        alert('Error updating complaint: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Error updating complaint');
    }
  };

  const deleteComplaint = async (id) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    
    try {
      const response = await fetch('/api/complaints/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        // Refresh complaints after deletion
        fetchStationComplaints();
        alert('Complaint deleted successfully');
      } else {
        const error = await response.json();
        alert('Error deleting complaint: ' + error.message);
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Error deleting complaint');
    }
  };

  const moveToInvestigation = (id) => {
    updateComplaintStatus(id, "Under Investigation");
  };

  const closeCase = (id) => {
    updateComplaintStatus(id, "Closed");
  };

  const deleteClosedCase = (id) => {
    deleteComplaint(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("commissioners");
    window.location.href = "/Commissaires-dashboard/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Commissaires Dashboard...</p>
        </div>
      </div>
    );
  }

  const commissionerData = JSON.parse(localStorage.getItem("commissioners") || '[{}]')[0] || {};

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-800 text-white p-6 flex flex-col">
        <div className="flex items-center mb-6">
          <Image
            src="/logo.jpeg"
            alt="E-OPROGEM Logo"
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <h1 className="text-2xl font-bold">Tableau de bord Commissaire</h1>
        </div>
        
        <div className="flex items-center mb-6 p-3 bg-blue-700 rounded-lg">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">{commissionerData.fullName || commissionerData.name || 'Commissaire'}</p>
            <p className="text-xs text-blue-300">{commissionerData.role || 'Commissaire de police'}</p>
            <p className="text-xs text-blue-200">{commissionerData.policeStation || 'Commissariat'}</p>
          </div>
        </div>
        <ul className="space-y-4">
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "officers" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("officers")}
          >
            <User size={18} /> Agents
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "complaints" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            <FileText size={18} /> Plaintes
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "investigation" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("investigation")}
          >
            <Shield size={18} /> En cours d'enquête
          </li>
          <li
            className={`flex items-center gap-2 cursor-pointer ${activeTab === "closed" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            <Archive size={18} /> Dossiers clôturés
          </li>
        </ul>
        
        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-3 text-red-300 hover:text-red-200 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Officers Section */}
        {activeTab === "officers" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Gérer les agents</h2>
            <div className="mb-6 bg-white shadow p-4 rounded-lg">
              <div className="flex gap-4 flex-wrap">
                <input
                  type="text"
                  placeholder="Nom"
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Grade"
                  value={newOfficer.rank}
                  onChange={(e) => setNewOfficer({ ...newOfficer, rank: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Numéro de badge"
                  value={newOfficer.badge}
                  onChange={(e) => setNewOfficer({ ...newOfficer, badge: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={newOfficer.username}
                  onChange={(e) => setNewOfficer({ ...newOfficer, username: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newOfficer.password}
                  onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                  className="border rounded p-2 flex-1"
                />
                {editingOfficer ? (
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Edit size={16} /> Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={addOfficer}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                )}
              </div>
            </div>

            {/* Officers Table */}
            {officersLoading ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des agents...</p>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border">Nom</th>
                      <th className="p-3 border">Grade</th>
                      <th className="p-3 border">Badge</th>
                      <th className="p-3 border">Nom d'utilisateur</th>
                      <th className="p-3 border">Mot de passe</th>
                      <th className="p-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(officers) && officers.map((officer) => (
                      <tr key={officer.id || officer._id} className="hover:bg-gray-100">
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
                            <Edit size={14} /> Modifier
                          </button>
                          <button
                            onClick={() => deleteOfficer(officer.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <br />

           
          </>
        )}

        {/* Complaints Section */}
        {activeTab === "complaints" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Plaintes du commissariat</h2>
            {complaintsLoading ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des plaintes...</p>
              </div>
            ) : (
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">ID du dossier</th>
                    <th className="p-3 border">Nom</th>
                    <th className="p-3 border">Titre</th>
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Statut</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(complaints) && complaints
                    .filter((c) => c.status === "Pending")
                    .map((complaint) => (
                      <tr key={complaint._id || complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.complaintId}</td>
                        <td className="p-3 border">{complaint.name}</td>
                        <td className="p-3 border">{complaint.title}</td>
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">{complaint.submissionDate}</td>
                        <td className="p-3 border flex gap-2">
                          <Link href={`/Commissaires-dashboard/case/${complaint._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">
                            Voir les détails
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}
          </>
        )}

        {/* Under Investigation Section */}
        {activeTab === "investigation" && (
          <>
            <h2 className="text-2xl font-bold mb-6">En cours d'enquête</h2>
            {complaintsLoading ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des plaintes...</p>
              </div>
            ) : (
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
                  {Array.isArray(complaints) && complaints
                    .filter((c) => c.status === "Under Investigation")
                    .map((complaint) => (
                      <tr key={complaint._id || complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.complaintId}</td>
                        <td className="p-3 border">{complaint.name}</td>
                        <td className="p-3 border">{complaint.title}</td>
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">{complaint.submissionDate}</td>
                        <td className="p-3 border">
                          <Link href={`/Commissaires-dashboard/case/${complaint._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}
          </>
        )}

        {/* Case Closed Section */}
        {activeTab === "closed" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Dossiers clôturés</h2>
            {complaintsLoading ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading complaints...</p>
              </div>
            ) : (
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
                  {Array.isArray(complaints) && complaints
                    .filter((c) => c.status === "Closed")
                    .map((complaint) => (
                      <tr key={complaint._id || complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.complaintId}</td>
                        <td className="p-3 border">{complaint.name}</td>
                        <td className="p-3 border">{complaint.title}</td>
                        <td className="p-3 border">{complaint.description}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">{complaint.submissionDate}</td>
                        <td className="p-3 border">
                          <Link href={`/Commissaires-dashboard/case/${complaint._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
