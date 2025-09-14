// components/ComplaintsTable.js
"use client";
import { useState, useEffect } from "react";

const ComplaintsTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserComplaints();
  }, []);

  const fetchUserComplaints = async () => {
    try {
      setLoading(true);
      
      // Get current user data
      const userData = localStorage.getItem("userData");
      const userRole = localStorage.getItem("userRole");
      
      if (!userData) {
        setError("User data not found. Please login again.");
        return;
      }

      const user = JSON.parse(userData);
      
      // Determine identifier and type based on user role
      let userIdentifier, userType;
      
      if (userRole === "anonymous") {
        userIdentifier = user.username;
        userType = "username";
      } else {
        // For regular users, use email as primary identifier
        userIdentifier = user.email;
        userType = "email";
      }

      console.log("Fetching complaints for:", { userIdentifier, userType });

      const response = await fetch("/api/getcomplaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier,
          userType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Complaints data:", data);
      
      setComplaints(data.complaints || []);
      
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in progress":
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "resolved":
      case "completed":
        return "text-green-600 bg-green-100";
      case "rejected":
      case "dismissed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      // Handle both date string and Date object
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading your complaints...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchUserComplaints}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📋</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Complaints Found</h3>
          <p className="text-gray-500">You haven't submitted any complaints yet.</p>
          <a 
            href="/complaint-form"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Your First Complaint
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Your Complaints ({complaints.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Police Station
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {complaint.complaintId || `CASE-${complaint._id.slice(-8)}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={complaint.title}>
                    {complaint.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                    {complaint.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{formatDate(complaint.submissionDate || complaint.createdAt)}</div>
                  <div className="text-xs text-gray-400">
                    {formatTime(complaint.submissionTime)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {complaint.policeStation || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {complaint.priority || "Normal"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      // Show complaint details (you can implement a modal here)
                      alert(`Complaint Details:\n\nTitle: ${complaint.title}\nDescription: ${complaint.description}\nStatus: ${complaint.status}`);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button 
          onClick={fetchUserComplaints}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default ComplaintsTable;