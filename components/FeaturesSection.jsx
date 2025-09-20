"use client"

import { Lock, FileText, Search, BarChart3, Bell, Users } from "lucide-react"

const FeaturesSection = () => {
  const features = [
    {
      icon: Lock,
      title: "Sécurisé et confidentiel",
      description:
        "Le chiffrement de bout en bout garantit la confidentialité et la protection de vos informations personnelles et des détails de votre dossier.",
    },
    {
      icon: FileText,
      title: "Dépôt de plainte en ligne",
      description:
        "Déposez des plaintes 24h/24 et 7j/7 depuis n'importe où grâce à notre formulaire en ligne convivial. Pas besoin de se rendre au commissariat au départ.",
    },
    {
      icon: Search,
      title: "Suivi des dossiers",
      description:
        "Mises à jour en temps réel sur le statut de votre dossier, les agents assignés et l'avancement de l'enquête via notre portail sécurisé.",
    },
    {
      icon: BarChart3,
      title: "Statistiques et rapports",
      description:
        "Accédez à des analyses et rapports détaillés pour comprendre les tendances des dossiers et les performances du système en toute transparence.",
    },
    {
      icon: Bell,
      title: "Notifications intelligentes",
      description:
        "Recevez des alertes instantanées par SMS et e-mail pour les mises à jour, audiences et développements importants.",
    },
    {
      icon: Users,
      title: "Expérience conviviale",
      description:
        "Notre plateforme est conçue pour être simple, intuitive et accessible à tous, quel que soit le niveau technique.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-blue-600 
            drop-shadow-[0_0_10px_#3b82f6]"
          >
            Fonctionnalités et avantages
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Conçu selon les dernières normes de sécurité et les meilleures pratiques UX
            pour la gestion de dossiers sensibles.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-blue-200 rounded-2xl 
              shadow-md hover:shadow-[0_0_15px_#3b82f6] transition-all duration-300 p-6 text-center"
            >
              {/* Icon */}
              <div className="mx-auto w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center 
              group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-7 w-7 text-blue-500 group-hover:text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-blue-600 mt-4 drop-shadow-[0_0_6px_#3b82f6]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Highlight */}
        <div
          className="mt-16 bg-white border border-blue-200 rounded-2xl 
          shadow-[0_0_15px_#3b82f6] p-8 text-center"
        >
          <Lock className="h-10 w-10 text-blue-600 mx-auto mb-4 drop-shadow-[0_0_8px_#3b82f6]" />
          <h3 className="text-lg font-bold text-blue-600 mb-3 drop-shadow-[0_0_6px_#3b82f6]">
            Sécurité de niveau gouvernemental
          </h3>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Notre plateforme répond aux normes de sécurité les plus élevées avec une conformité ISO 27001,
            des audits de sécurité réguliers et des protocoles de protection des données approuvés par les autorités.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
