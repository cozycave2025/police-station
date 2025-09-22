"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CaseDetailsPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [assignedAgent, setAssignedAgent] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const closeThisCase = async () => {
    try {
      if (!confirm("Êtes-vous sûr de vouloir clôturer cette affaire ?")) return;
      const res = await fetch('/api/complaints/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Closed' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Échec de la clôture de l'affaire");
      alert("Affaire clôturée avec succès");
      // Navigate back to dashboard so the Closed tab shows the case
      router.push('/Commissaires-dashboard');
    } catch (e) {
      console.error(e);
      alert(e.message || "Échec de la clôture de l'affaire");
    }
  };

  // Helper to refresh only reports list based on current assigned agent
  const refreshReports = async () => {
    try {
      const qs = new URLSearchParams({ complaintId: id });
      if (assignedAgent) qs.set("agentUsername", assignedAgent);
      const rRes = await fetch(`/api/police_agent/report?${qs.toString()}`);
      const rData = await rRes.json();
      setReports(Array.isArray(rData?.reports) ? rData.reports : []);
    } catch (e) {
      console.error(e);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const res = await fetch('/api/police_agent/report', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Échec de la mise à jour');
      await refreshReports();
    } catch (e) {
      console.error(e);
      alert(e.message || 'Échec de la mise à jour');
    }
  };

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await fetch(`/api/cases/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Échec du chargement de l'affaire");
        setCaseData(data);
      } catch (e) {
        console.error(e);
        alert(e.message || "Erreur lors du chargement de l'affaire");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCase();
  }, [id]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setPerformanceLoading(true);
        // 1) Get latest assignment to determine agentUsername
        const aRes = await fetch(`/api/assignments/${id}`);
        const aData = await aRes.json();
        const latest = Array.isArray(aData) && aData.length > 0 ? aData[0] : null;
        const agentUsername = latest?.agentUsername || "";
        setAssignedAgent(agentUsername);

        // 2) Fetch reports for this complaint and agent
        const qs = new URLSearchParams({ complaintId: id });
        if (agentUsername) qs.set("agentUsername", agentUsername);
        const rRes = await fetch(`/api/police_agent/report?${qs.toString()}`);
        const rData = await rRes.json();
        setReports(Array.isArray(rData?.reports) ? rData.reports : []);
      } catch (e) {
        console.error(e);
      } finally {
        setPerformanceLoading(false);
      }
    };
    if (id) fetchPerformance();
  }, [id]);

  const openAssign = async () => {
    try {
      const res = await fetch("/api/police_agent/officers");
      const data = await res.json();
      if (Array.isArray(data)) setOfficers(data);
      setShowAssignModal(true);
    } catch (e) {
      console.error(e);
      alert("Échec du chargement des agents");
    }
  };

  const submitAssignment = async () => {
    try {
      setSubmitting(true);
      const commissioners = JSON.parse(localStorage.getItem("commissioners") || "[]");
      const commissionerUsername = commissioners?.[0]?.username;
      if (!commissionerUsername) {
        alert("Le commissaire n'est pas connecté");
        return;
      }
      if (!selectedAgent) {
        alert("Veuillez sélectionner un agent");
        return;
      }
      const res = await fetch("/api/Commissaires/assign_case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId: id,
          agentUsername: selectedAgent,
          message,
          commissionerUsername,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Échec de l'assignation de l'affaire");

      // Update complaint status to Under Investigation
      const upRes = await fetch('/api/complaints/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Under Investigation' })
      });
      const upData = await upRes.json();
      if (!upRes.ok) {
        throw new Error(upData?.message || "Échec de la mise à jour du statut de la plainte");
      }

      // Reflect status locally and close modal
      setCaseData((prev) => ({ ...prev, status: 'Under Investigation' }));
      setShowAssignModal(false);
      alert("Affaire assignée et passée à 'En enquête'");
      // Navigate back to dashboard to reflect lists
      router.push('/Commissaires-dashboard');
    } catch (e) {
      console.error(e);
      alert(e.message || "Échec de l'assignation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement de l'affaire...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6">
        <p className="text-red-600">Affaire introuvable.</p>
        <Link href="/Commissaires-dashboard" className="text-blue-600 underline">Retour</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Détails de l'affaire</h1>
          <Link href="/Commissaires-dashboard" className="text-blue-600 underline">Retour au tableau de bord</Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID de l'affaire</p>
              <p className="font-medium">{caseData._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="font-medium">{caseData.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">{caseData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Titre</p>
              <p className="font-medium">{caseData.title}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{caseData.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{caseData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CNIC</p>
              <p className="font-medium">{caseData.cnic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commissariat</p>
              <p className="font-medium">{caseData.policeStation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de soumission</p>
              <p className="font-medium">{caseData.submissionDate}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={openAssign} className="bg-blue-600 text-white px-4 py-2 rounded">
            Assigner l'affaire
          </button>
          {caseData?.status !== 'Closed' && (
            <button onClick={closeThisCase} className="bg-red-600 text-white px-4 py-2 rounded">
              Clôturer l'affaire
            </button>
          )}
        </div>

        {/* Performance de l'assignation */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-2">Performance de l'assignation</h2>
          <p className="text-sm text-gray-600 mb-4">Agent : {assignedAgent || 'N/A'}</p>
          {performanceLoading ? (
            <div className="text-center text-gray-600">Chargement des rapports...</div>
          ) : reports.length === 0 ? (
            <div className="text-gray-600">Aucun rapport soumis pour cette assignation pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">Soumis le</th>
                    <th className="p-3 border">Titre</th>
                    <th className="p-3 border">Statut du rapport</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                      <td className="p-3 border">{r.complaint?.title || '-'}</td>
                      <td className="p-3 border">{r.status || 'Pending'}</td>
                      <td className="p-3 border flex gap-2">
                        <button
                          onClick={() => updateReportStatus((r._id && r._id.toString) ? r._id.toString() : (r._id?.$oid || r._id), 'Approved')}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => updateReportStatus((r._id && r._id.toString) ? r._id.toString() : (r._id?.$oid || r._id), 'Rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Rejeter
                        </button>
                        <button onClick={() => { setSelectedReport(r); setShowReportModal(true); }} className="bg-blue-600 text-white px-3 py-1 rounded">Voir les détails</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Assigner l'affaire</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Sélectionner un agent</label>
              <select
                className="w-full border rounded p-2"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">-- Choisir un agent --</option>
                {officers.map((o) => (
                  <option key={o._id} value={o.username}>
                    {o.name} ({o.username}) - {o.policeStation} {o.city ? `, ${o.city}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Message à l'agent (facultatif)</label>
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Fournissez des instructions supplémentaires pour l'agent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 rounded border" disabled={submitting}>
                Annuler
              </button>
              <button onClick={submitAssignment} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" disabled={submitting}>
                {submitting ? "Attribution..." : "Valider l'assignation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Détails du rapport</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Titre</p>
                <p className="font-medium">{selectedReport?.complaint?.title || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <p className="font-medium">{selectedReport?.complaint?.status || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium whitespace-pre-line">{selectedReport?.complaint?.description || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commissariat</p>
                <p className="font-medium">{selectedReport?.policeStation || selectedReport?.complaint?.policeStation || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Soumis le</p>
                <p className="font-medium">{selectedReport?.createdAt ? new Date(selectedReport.createdAt).toLocaleString() : '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Fichier du rapport</p>
                {selectedReport?.reportUrl ? (
                  <a href={selectedReport.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{selectedReport.reportUrl}</a>
                ) : (
                  <p className="font-medium">-</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded border">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
