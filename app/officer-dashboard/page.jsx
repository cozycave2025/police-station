"use client";

import { useState, useEffect } from "react";
import { FileText, Shield, Archive, User, LogOut, Upload } from "lucide-react";
import Image from "next/image";

export default function OfficerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [assignedCases, setAssignedCases] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
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

  const openReportModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReportFile(null);
    setShowReportModal(true);
  };

  // Fetch assigned cases for this officer
  const fetchAssignedCases = async () => {
    setAssignedLoading(true);
    try {
      const officerData = JSON.parse(localStorage.getItem("officerData") || '{}');
      if (!officerData?.username) return;
      const res = await fetch('/api/assigned_cases/by_officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentUsername: officerData.username })
      });
      const data = await res.json();
      if (res.ok) {
        setAssignedCases(data.assignments || []);
      }
    } catch (e) {
      console.error('Error fetching assigned cases', e);
    } finally {
      setAssignedLoading(false);
    }
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedComplaint(null);
    setReportFile(null);
  };

  // Fetch reports for this officer
  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const officerData = JSON.parse(localStorage.getItem("officerData") || '{}');
      if (!officerData?.username) return;
      const qs = new URLSearchParams({
        agentUsername: officerData.username || '',
        policeStation: officerData.policeStation || '',
      });
      const res = await fetch(`/api/police_agent/report?${qs.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error('Error fetching reports', e);
    } finally {
      setReportsLoading(false);
    }
  };

  const uploadReport = async () => {
    if (!reportFile) {
      alert('Please choose a PDF or image file.');
      return;
    }
    try {
      setIsUploading(true);
      const officerData = JSON.parse(localStorage.getItem("officerData") || '{}');
      const formData = new FormData();
      formData.append('file', reportFile);
      formData.append('complaint', JSON.stringify(selectedComplaint));
      formData.append('agentName', officerData?.name || '');
      formData.append('agentUsername', officerData?.username || '');
      formData.append('station', officerData?.policeStation || '');

      const res = await fetch('/api/police_agent/report', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to upload report');
      }
      alert('Report uploaded successfully');
      closeReportModal();
      // Refresh reports list so the new report appears under Reports tab
      fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

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
    fetchAssignedCases();
    fetchReports();
  }, []);

  // Refetch reports when switching to Reports tab
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const openAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };
  const closeAssignmentDetails = () => {
    setShowDetailModal(false);
    setSelectedAssignment(null);
    setViewingId(null);
  };

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
          <p className="mt-4 text-gray-600 text-lg">Chargement du tableau de bord de l'agent...</p>
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
            <h1 className="text-2xl font-bold">Tableau de bord Agent</h1>
          </div>
          
          <div className="flex items-center mb-6 p-3 bg-blue-700 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">{JSON.parse(localStorage.getItem("officerData") || '{}').name || 'Agent'}</p>
              <p className="text-xs text-blue-300">Agent de police</p>
            </div>
          </div>
          <ul className="space-y-4">
            <li
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "complaints" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("complaints")}
            >
              <FileText size={18} /> Plaintes
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "reports" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("reports")}
            >
              <Shield size={18} /> Rapports
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer ${
                activeTab === "closed" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("closed")}
            >
              <Archive size={18} /> Statut des rapports
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
            {/* Section Plaintes */}
            <br/>
            {activeTab === "complaints" && (
              <>
                <h2 className="text-2xl font-bold mb-6">Plaintes assignées</h2>
                {assignedLoading ? (
                  <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des plaintes assignées...</p>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-3 border">Titre</th>
                          <th className="p-3 border">Description</th>
                          <th className="p-3 border">Statut</th>
                          <th className="p-3 border">Assignée le</th>
                          <th className="p-3 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedCases
                          .filter((a) => a.complaintStatus !== 'In Progress')
                          .map((a) => (
                          <tr key={a._id} className="hover:bg-gray-100">
                            <td className="p-3 border">{a.complaint?.title || '-'}</td>
                            <td className="p-3 border">{a.complaint?.description || '-'}</td>
                            <td className="p-3 border">{a.complaint?.status || a.status}</td>
                            <td className="p-3 border">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}</td>
                            <td className="p-3 border flex gap-2 flex-wrap">
                              <button
                                onClick={() => { setViewingId(a._id); setTimeout(() => openAssignmentDetails(a), 300); }}
                                className={`bg-blue-600 text-white px-3 py-1 rounded ${viewingId === a._id ? 'opacity-50 pointer-events-none' : ''}`}
                              >
                                {viewingId === a._id ? 'Chargement...' : 'Voir les détails'}
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

            {/* Section Rapports */}
            {activeTab === "reports" && (
              <>
                <h2 className="text-2xl font-bold mb-6">Rapports</h2>
                {reportsLoading ? (
                  <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des rapports...</p>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-3 border">Titre</th>
                          <th className="p-3 border">Statut du rapport</th>
                          <th className="p-3 border">Soumis le</th>
                          <th className="p-3 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => (
                          <tr key={r._id} className="hover:bg-gray-100">
                            <td className="p-3 border">{r.complaint?.title || '-'}</td>
                            <td className="p-3 border">{r.status || 'Pending'}</td>
                            <td className="p-3 border">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                            <td className="p-3 border flex gap-2 flex-wrap">
                              {r.reportUrl && (
                                <a href={r.reportUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1 rounded">Ouvrir</a>
                              )}
                              <button onClick={() => { setSelectedReport(r); setShowReportDetailModal(true); }} className="bg-blue-600 text-white px-3 py-1 rounded">Voir les détails</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Section Statut des rapports */}
            {activeTab === "closed" && (
              <>
                <h2 className="text-2xl font-bold mb-6">Statut des rapports</h2>
                {reportsLoading ? (
                  <div className="bg-white shadow rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reports...</p>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-3 border">Title</th>
                          <th className="p-3 border">Report Status</th>
                          <th className="p-3 border">Submitted At</th>
                          <th className="p-3 border">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => (
                          <tr key={r._id} className="hover:bg-gray-100">
                            <td className="p-3 border">{r.complaint?.title || '-'}</td>
                            <td className="p-3 border">{r.status || 'Pending'}</td>
                            <td className="p-3 border">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                            <td className="p-3 border flex gap-2 flex-wrap">
                              <button onClick={() => { setSelectedReport(r); setShowReportDetailModal(true); }} className="bg-blue-600 text-white px-3 py-1 rounded">View Details</button>
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

        {/* Assignment Details Modal */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Détails de l'assignation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Titre</p>
                  <p className="font-medium">{selectedAssignment?.complaint?.title || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium">{selectedAssignment?.complaint?.status || selectedAssignment?.status}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-line">{selectedAssignment?.complaint?.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commissariat</p>
                  <p className="font-medium">{selectedAssignment?.policeStation || selectedAssignment?.complaint?.policeStation || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ville</p>
                  <p className="font-medium">{selectedAssignment?.city || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assignée le</p>
                  <p className="font-medium">{selectedAssignment?.createdAt ? new Date(selectedAssignment.createdAt).toLocaleString() : '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Message du commissaire</p>
                  <p className="font-medium whitespace-pre-line">{selectedAssignment?.message || '-'}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={closeAssignmentDetails} className="px-4 py-2 rounded border">Fermer</button>
                <button onClick={() => openReportModal(selectedAssignment?.complaint)} className="px-4 py-2 rounded bg-blue-600 text-white">Ajouter un rapport</button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">Ajouter un rapport</h3>
              <p className="text-sm text-gray-600 mb-3">
                Plainte : {selectedComplaint?.description || selectedComplaint?.complaintType}
              </p>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                className="w-full border rounded p-2 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeReportModal}
                  className="px-4 py-2 rounded border"
                  disabled={isUploading}
                >
                  Annuler
                </button>
                <button
                  onClick={uploadReport}
                  className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                  disabled={isUploading}
                >
                  {isUploading ? 'Téléchargement...' : 'Téléverser le rapport'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Details Modal */}
        {showReportDetailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Report Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">{selectedReport?.complaint?.title || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedReport?.complaint?.status || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium whitespace-pre-line">{selectedReport?.complaint?.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Police Station</p>
                  <p className="font-medium">{selectedReport?.policeStation || selectedReport?.complaint?.policeStation || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted At</p>
                  <p className="font-medium">{selectedReport?.createdAt ? new Date(selectedReport.createdAt).toLocaleString() : '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Report File</p>
                  {selectedReport?.reportUrl ? (
                    <a href={selectedReport.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{selectedReport.reportUrl}</a>
                  ) : (
                    <p className="font-medium">-</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setShowReportDetailModal(false)} className="px-4 py-2 rounded border">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}
