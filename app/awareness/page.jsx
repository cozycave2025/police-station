"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Calendar, User, ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function AwarenessPage() {
  const [awarenessMessages, setAwarenessMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  // Fetch awareness messages from backend
  const fetchAwarenessMessages = async () => {
    try {
      const response = await fetch('/api/awareness');
      if (response.ok) {
        const data = await response.json();
        setAwarenessMessages(data.awareness || []);
        setFilteredMessages(data.awareness || []);
      } else {
        console.error('Failed to fetch awareness messages');
      }
    } catch (error) {
      console.error('Error fetching awareness messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwarenessMessages();
  }, []);

  // Filter messages based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMessages(awarenessMessages);
    } else {
      const filtered = awarenessMessages.filter(message =>
        message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchTerm, awarenessMessages]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </Link>
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Messages de Sensibilisation</h1>
                  <p className="text-sm text-gray-600">Informations importantes pour la communauté</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des messages...</p>
            </div>
          </div>
        )}

        {/* Messages Grid */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMessages.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Aucun message trouvé" : "Aucun message de sensibilisation"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? "Essayez avec d'autres mots-clés" 
                    : "Les messages de sensibilisation apparaîtront ici"
                  }
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {message.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          {message.createdAt ? formatDate(message.createdAt) : 'Date non disponible'}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                        {message.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        Administration
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                        Lire plus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats Section */}
        {!loading && filteredMessages.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {awarenessMessages.length}
                </div>
                <div className="text-sm text-gray-600">Messages total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {awarenessMessages.filter(m => {
                    const date = new Date(m.createdAt);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 7;
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Cette semaine</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {filteredMessages.length}
                </div>
                <div className="text-sm text-gray-600">Résultats affichés</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}