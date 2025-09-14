
import { AlertTriangle, Clock, MapPin } from "lucide-react";

const urgentCases = [
  {
    id: "URG-001",
    type: "Viol d'enfant",
    location: "Conakry, Matam",
    time: "Il y a 2h",
    priority: "CRITIQUE"
  },
  {
    id: "URG-002",
    type: "Violence conjugale",
    location: "Kankan",
    time: "Il y a 4h",
    priority: "URGENT"
  },
  {
    id: "URG-003",
    type: "Harcèlement sexuel",
    location: "Labé",
    time: "Il y a 6h",
    priority: "URGENT"
  }
];

export  function UrgentAlerts() {
  return (
    <div className="bg-white border border-blue-200 rounded-xl shadow-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          Alertes Urgentes
        </h3>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
          {urgentCases.length} cas
        </span>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {urgentCases.map((case_) => (
          <div
            key={case_.id}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm">
                  {case_.type}
                </h4>
                <div className="flex items-center text-xs text-gray-600 mt-1 space-x-3">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {case_.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {case_.time}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  case_.priority === "CRITIQUE"
                    ? "bg-red-600 text-white"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {case_.priority}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-600">
                #{case_.id}
              </span>
              <button className="px-3 py-1 border border-blue-300 rounded-md text-xs hover:bg-blue-100 transition">
                Traiter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer button */}
      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition">
        Voir tous les cas urgents
      </button>
    </div>
  );
}
