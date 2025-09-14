"use client";

import { Plus, Search, Newspaper, MessageSquare, Phone, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    icon: Plus,
    title: "Signaler un Cas",
    description: "Créer un nouveau signalement",
    color:
      "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
    urgent: true,
    link: "/compalint-form",
  },
  {
    icon: Check,
    title: "plainte résolue",
    description: "Vérifiez votre plainte résolue",
    color: "bg-purple-500 hover:bg-purple-600",
    link: "/complaint-status",
  },
  {
    icon: Newspaper,
    title: "Lire les Actualités",
    description: "Dernières nouvelles et mises à jour",
    color:
      "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600",
    link: "/news",
  },
  {
    icon: MessageSquare,
    title: "Messages de Sensibilisation",
    description: "Campagnes de prévention",
    color: "bg-green-500 hover:bg-green-600",
    link: "/awareness",
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-blue-500 dark:text-gray-100 mb-4">
          Actions Rapides
        </h2>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={() => action.link && router.push(action.link)} // 👈 click par navigate karega
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg text-white transition-transform group-hover:scale-105 ${action.color}`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                  {action.urgent && (
                    <div className="mt-2">
                      <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full">
                        Priorité
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Numéros d'Urgence
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aide immédiate 24h/7j
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl text-gray-900 dark:text-gray-100">
              116
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Ligne verte nationale
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
