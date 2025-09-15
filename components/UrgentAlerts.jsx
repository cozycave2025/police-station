
"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, MapPin } from "lucide-react";

export function UrgentAlerts() {
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch urgent alerts from backend
  const fetchUrgentAlerts = async () => {
    try {
      const response = await fetch('/api/alert');
      if (response.ok) {
        const data = await response.json();
        setUrgentAlerts(data.alerts || []);
      } else {
        console.error('Failed to fetch urgent alerts');
      }
    } catch (error) {
      console.error('Error fetching urgent alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrgentAlerts();
  }, []);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Il y a moins d'1h";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  };
  return (
    <div className="bg-white border border-blue-200 rounded-xl shadow-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          Alertes Urgentes
        </h3>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
          {urgentAlerts.length} cas
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Chargement des alertes...</span>
        </div>
      )}

      {/* Cases List */}
      {!loading && (
        <div className="space-y-3">
          {urgentAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucune alerte urgente pour le moment</p>
            </div>
          ) : (
            urgentAlerts.map((alert) => (
              <div
                key={alert._id}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {alert.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-600 mt-1 space-x-3">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.createdAt ? formatTimeAgo(alert.createdAt) : 'Récent'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">
                    URGENT
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-gray-600">
                    Crime: {alert.crime}
                  </span>
                  <button className="px-3 py-1 border border-blue-300 rounded-md text-xs hover:bg-blue-100 transition">
                    Traiter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer button */}
      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition">
        Voir tous les cas urgents
      </button>
    </div>
  );
}
