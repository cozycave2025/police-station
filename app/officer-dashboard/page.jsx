"use client";

import { useState, useEffect } from "react";
import { FileText, Shield, Archive, User, LogOut } from "lucide-react";
import Image from "next/image";

export default function OfficerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("isOfficerLoggedIn");
    if (!loggedIn) {
      window.location.href = "/officer-dashboard/login";
    }
    setIsLoading(false);
  }, []);

  // Default Complaints
  const defaultComplaints = [
    { id: 1, description: "Street robbery reported in Karachi", status: "Pending" },
    { id: 2, description: "Car theft reported in Lahore", status: "Pending" },
    { id: 3, description: "House burglary reported in Islamabad", status: "Pending" },
  ];

  const [activeTab, setActiveTab] = useState("complaints");
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  // Fetch complaints from database based on officer's station
  const fetchStationComplaints = async () => {
    setComplaintsLoading(true);
    try {
      const officerData = JSON.parse(localStorage.getItem("officerData"));
      console.log(officerData.username);
      if (!officerData) return;

      const response = await fetch("/api/getcomplaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: officerData.username,
          userType: "officer"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error("Error fetching station complaints:", error);
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Load complaints from database
  useEffect(() => {
    fetchStationComplaints();
  }, []);

  // Database integration for complaint status updates
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

  // Actions
  const moveToInvestigation = (id) => {
    updateComplaintStatus(id, "Under Investigation");
  };

  const closeCase = (id) => {
    updateComplaintStatus(id, "Closed");
  };

  const deleteClosedCase = (id) => {
    deleteComplaint(id);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isOfficerLoggedIn");
    window.location.href = "/officer-dashboard/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Officer Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-800 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-6">
            <Image
              src="/logo.jpeg"
              alt="E-OPROGEM Logo"
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <h1 className="text-2xl font-bold">Officer Dashboard</h1>
          </div>
          
          <div className="flex items-center mb-6 p-3 bg-blue-700 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">{JSON.parse(localStorage.getItem("officerData") || '{}').name || 'Officer'}</p>
              <p className="text-xs text-blue-300">Police Officer</p>
            </div>
          </div>
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
        {/* Complaints Section */}
        <br/>
        {activeTab === "complaints" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Pending Complaints</h2>
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
                      <th className="p-3 border">Description</th>
                      <th className="p-3 border">Status</th>
                      <th className="p-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints
                      .filter((c) => c.status === "Pending")
                      .map((complaint) => (
                      <tr key={complaint._id || complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.description || complaint.complaintType}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border flex gap-2">
                          <button
                            onClick={() => moveToInvestigation(complaint._id || complaint.id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Under Investigation
                          </button>
                          <button
                            onClick={() => closeCase(complaint._id || complaint.id)}
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
            )}
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
                      <tr key={complaint._id || complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.description || complaint.complaintType}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => closeCase(complaint._id || complaint.id)}
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
                      <tr key={complaint._id || complaint.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{complaint.description || complaint.complaintType}</td>
                        <td className="p-3 border">{complaint.status}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => deleteClosedCase(complaint._id || complaint.id)}
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
