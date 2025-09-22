import { Bell, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData") || localStorage.getItem("currentUser") || "null");
    setCurrentUser(user);
    
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b border-blue-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 justify-between items-center min-h-16 py-2">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.jpeg"
              alt="E-OPROGEM Logo"
              width={40}
              height={40}
              className="rounded-lg shadow-lg"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-blue-600 leading-tight">E-OPROGEM</h1>
              <p className="hidden sm:block text-sm text-gray-600 leading-tight">
                Système de Gestion des Violences Basées sur le Genre
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Notification Button */}
          
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {currentUser ? currentUser.fullName : "Guest User"}
                </p>
                <p className="text-gray-600">
                  {currentUser
                    ? currentUser.role.replace("-", " ").toUpperCase()
                    : "No Role"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition whitespace-nowrap"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
