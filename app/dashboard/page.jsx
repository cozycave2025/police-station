"use client"
import { DashboardHeader } from "../../components/DashboardHeader";
import { QuickActions } from "../../components/QuickActions";
import { UrgentAlerts } from "../../components/UrgentAlerts";
import { AwarenessCarousel } from "../../components/AwarenessCarousel";
import ComplaintsTable from "../../components/ComplaintsTable";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("isUserLoggedIn");

    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsAuthenticated(true);
      setRole(user.role); // <-- yahan se role check karega
    } else {
      window.location.href = "/login";
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // agar role complainant hai to ye dashboard show hoga
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
          {/* Actions rapides (déposer une plainte, etc.) */}
          <QuickActions />
          <br />

          {/* My Complaints */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes plaintes</h2>
          <ComplaintsTable />
          <br />

          {/* Urgent Alerts */}
          <UrgentAlerts />
          <br />

          {/* Awareness Section */}
          <AwarenessCarousel />
        </main>
      </div>
    );


}
