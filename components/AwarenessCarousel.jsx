"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Shield, Phone } from "lucide-react";

const messages = [
  {
    icon: Shield,
    title: "Le viol est un crime",
    description: "Aucune excuse ne justifie la violence. Signalez tout cas immédiatement.",
    color: "bg-blue-600 text-white"
  },
  {
    icon: Heart,
    title: "La honte doit changer de camp",
    description: "Les victimes ne sont jamais responsables. Le soutien et la justice sont leurs droits.",
    color: "bg-gray-100 text-blue-600"
  },
  {
    icon: Phone,
    title: "Numéro vert: 116",
    description: "Aide immédiate, confidentielle et gratuite. Disponible 24h/24, 7j/7.",
    color: "bg-blue-100 text-gray-900"
  },
  {
    icon: Shield,
    title: "Brisons le silence",
    description: "Votre voix compte. Ensemble, nous pouvons mettre fin aux violences basées sur le genre.",
    color: "bg-gray-100 text-blue-600"
  }
];

export function AwarenessCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % messages.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);

  const currentMessage = messages[currentIndex];

  return (
    <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 shadow-lg border border-blue-400 rounded-xl overflow-hidden">
      <div className="p-0">
        <div className="relative">
          {/* Current Message */}
          <div className={`${currentMessage.color} p-6 transition-all duration-500`}>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-200 p-3 rounded-full flex-shrink-0">
                <currentMessage.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{currentMessage.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{currentMessage.description}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={prev}
              className="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-400 rounded-full p-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={next}
              className="mr-2 bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-400 rounded-full p-1"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 p-4 bg-gray-100">
          {messages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-500 w-6"
                  : "bg-gray-400 hover:bg-gray-500 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
