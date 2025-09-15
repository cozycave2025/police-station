"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ComplaintStatusPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("cnic");
  const [error, setError] = useState("");

  // Fetch complaints based on user identifier
  const fetchUserComplaints = async (userIdentifier, userType) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/getcomplaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: userIdentifier,
          userType: userType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints || []);
        if (data.complaints.length === 0) {
          setError("No complaints found for this user");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch complaints");
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Error fetching complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search value");
      return;
    }
    fetchUserComplaints(searchQuery.trim(), searchType);
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'text-yellow-600 bg-yellow-100',
          text: 'Pending'
        };
      case 'under investigation':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'text-blue-600 bg-blue-100',
          text: 'Under Investigation'
        };
      case 'closed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-600 bg-green-100',
          text: 'Closed'
        };
      default:
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-gray-600 bg-gray-100',
          text: status || 'Unknown'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complaint Status Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track the status of your complaints by searching with your details
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search By
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cnic">CNIC Number</option>
                <option value="phone">Phone Number</option>
                <option value="email">Email Address</option>
                <option value="username">Full Name</option>
              </select>
            </div>
            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your {searchType === 'cnic' ? 'CNIC' : searchType === 'phone' ? 'Phone' : searchType === 'email' ? 'Email' : 'Name'}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Enter your ${searchType === 'cnic' ? 'CNIC number' : searchType === 'phone' ? 'phone number' : searchType === 'email' ? 'email address' : 'full name'}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Results Section */}
        {complaints.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Complaints ({complaints.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complaint ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type/Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Police Station
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((complaint, index) => {
                    const statusDisplay = getStatusDisplay(complaint.status);
                    return (
                      <tr key={complaint._id || complaint.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {complaint.complaintId || complaint._id?.slice(-6) || `C${index + 1}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.title || complaint.complaintType || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={complaint.description}>
                            {complaint.description || 'No description available'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                            {statusDisplay.icon}
                            {statusDisplay.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.policeStation || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.submissionDate || 
                           (complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!loading && complaints.length === 0 && !error && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Use the search form above to find your complaints
            </p>
          </div>
        )}
      </div>
    </div>
  );
}