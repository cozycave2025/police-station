"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Users,
  Shield,
  FileText,
  Newspaper,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { UrgentAlerts } from "../../components/UrgentAlerts";
import Image from "next/image";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [name, setName] = useState("");
  const [showCommissionerModal, setShowCommissionerModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAwarenessModal, setShowAwarenessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasMoreComplaints, setHasMoreComplaints] = useState(false);
  const [complaintsPage, setComplaintsPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Commissioners data structure
  const defaultCommissioners = [
    {
      id: 1,
      name: "Jean Dupont",
      username: "j.dupont",
      password: "password123",
      badgeId: "COM001",
      city: "Paris",
      policeStation: "Commissariat Central Paris",
      region: "Île-de-France",
      phone: "+33 1 42 60 33 22",
      email: "j.dupont@police.gov.fr",
    },
    {
      id: 2,
      name: "Marie Curie",
      username: "m.curie",
      password: "secure456",
      badgeId: "COM002",
      city: "Marseille",
      policeStation: "Commissariat de Marseille",
      region: "Provence-Alpes-Côte d'Azur",
      phone: "+33 4 91 39 80 00",
      email: "m.curie@police.gov.fr",
    },
  ];

  // Police stations data structure
  const defaultStations = [
    {
      id: 1,
      name: "Commissariat Central Paris",
      city: "Paris",
      commander: "Jean Dupont",
      officers: 45,
    },
    {
      id: 2,
      name: "Commissariat de Marseille",
      city: "Marseille",
      commander: "Marie Curie",
      officers: 38,
    },
  ];

  // Complaints data structure
  const defaultComplaints = [
    {
      id: 1757551790427,
      name: "David",
      cnic: "15899419579",
      phone: "699789459944",
      address: "xyz",
      title: "test",
      description: "this is a text",
      evidence: "image (15).jpg",
      status: "Closed",
      submissionDate: "2025-09-11",
      submissionTime: "05:49:50",
    },
  ];

  // Unified news data structure
  const [allNews, setAllNews] = useState([]);

  // Awareness messages data structure
  const [awarenessMessages, setAwarenessMessages] = useState([]);

  // Urgent Alerts data structure
  const defaultAlerts = [
    {
      id: 1,
      title: "Robbery Alert",
      location: "Central Paris",
      crime: "Armed Robbery",
      createdAt: "2025-09-11",
    },
  ];

  // Initialize state with default values
  const [commissioners, setCommissioners] = useState(defaultCommissioners);
  const [stations, setStations] = useState(defaultStations);
  const [complaints, setComplaints] = useState(defaultComplaints);
  const [alerts, setAlerts] = useState(defaultAlerts);

  // Fetch stations from backend
  const fetchStations = async () => {
    try {
      const response = await fetch('/api/addstation');
      if (response.ok) {
        const data = await response.json();
        setStations(data);
      } else {
        console.error('Failed to fetch stations');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  // Fetch news from backend
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setAllNews(data.news || []);
      } else {
        console.error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // Fetch awareness messages from backend
  const fetchAwarenessMessages = async () => {
    try {
      const response = await fetch('/api/awareness');
      if (response.ok) {
        const data = await response.json();
        setAwarenessMessages(data.awareness || []);
      } else {
        console.error('Failed to fetch awareness messages');
      }
    } catch (error) {
      console.error('Error fetching awareness messages:', error);
    }
  };

  // Fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alert');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      } else {
        console.error('Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchCommissioners = async () => {
    try {
      const response = await fetch('/api/Commissaires');
      if (response.ok) {
        const data = await response.json();
        setCommissioners(data.commissioners || []);
      } else {
        console.error('Failed to fetch commissioners');
        setCommissioners(defaultCommissioners);
      }
    } catch (error) {
      console.error('Error fetching commissioners:', error);
      setCommissioners(defaultCommissioners);
    }
  };

  const fetchComplaints = async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`/api/getcomplaints?page=${page}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setComplaints(data.complaints || []);
        } else {
          setComplaints(prev => [...prev, ...(data.complaints || [])]);
        }
        setHasMoreComplaints(data.hasMore || false);
      } else {
        console.error('Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  // Load data from localStorage and handle authentication
  useEffect(() => {
    const initializeAdmin = async () => {
      if (typeof window !== "undefined") {
        setName(localStorage.getItem("adminname") || "");
        const loggedIn = localStorage.getItem("isAdminLoggedIn");
        if (!loggedIn) {
          window.location.href = "/admin/login";
          return;
        }

        setDataLoading(true);

        const savedAlerts = localStorage.getItem("alerts");
        if (savedAlerts) {
          try {
            const parsedAlerts = JSON.parse(savedAlerts);
            if (Array.isArray(parsedAlerts)) {
              setAlerts(parsedAlerts);
            } else {
              setAlerts(defaultAlerts);
            }
          } catch (error) {
            console.error('Error parsing alerts from localStorage:', error);
            setAlerts(defaultAlerts);
          }
        }

        // Fetch data from backend
        try {
          await Promise.all([
            fetchStations(),
            fetchNews(),
            fetchAwarenessMessages(),
            fetchAlerts(),
            fetchCommissioners(),
            fetchComplaints(1, 5)
          ]);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setDataLoading(false);
          setIsLoading(false);
        }
      }
    };

    initializeAdmin();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && Array.isArray(commissioners)) {
      localStorage.setItem("commissioners", JSON.stringify(commissioners));
    }
  }, [commissioners]);

  // Remove localStorage saving for stations since we're using backend API

  useEffect(() => {
    if (typeof window !== "undefined" && Array.isArray(complaints)) {
      localStorage.setItem("complaints", JSON.stringify(complaints));
    }
  }, [complaints]);

  // News is now managed via API, no localStorage needed

  useEffect(() => {
    if (typeof window !== "undefined" && Array.isArray(alerts)) {
      localStorage.setItem("alerts", JSON.stringify(alerts));
    }
  }, [alerts]);

  const [newCommissioner, setNewCommissioner] = useState({
    id: null,
    name: "",
    username: "",
    password: "",
    badgeId: "",
    city: "",
    policeStation: "",
    region: "",
    phone: "",
    email: "",
  });

  const [newStation, setNewStation] = useState({
    id: null,
    name: "",
    city: "",
    commander: "",
    officers: "",
  });

  const [newComplaint, setNewComplaint] = useState({
    id: null,
    name: "",
    cnic: "",
    phone: "",
    address: "",
    title: "",
    description: "",
    evidence: "",
    status: "Open",
    submissionDate: "",
    submissionTime: "",
  });

  const [newNews, setNewNews] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    category: "",
    type: "regular",
  });

  const [newAlert, setNewAlert] = useState({
    id: null,
    title: "",
    location: "",
    crime: "",
    description: "",
    createdAt: "",
  });

  const [newAwareness, setNewAwareness] = useState({
    id: null,
    title: "",
    description: "",
  });

  // Save Commissioner
  const handleSaveCommissioner = async () => {
    if (!newCommissioner.name || !newCommissioner.username || !newCommissioner.badgeId) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const method = newCommissioner._id ? 'PUT' : 'POST';
      const body = newCommissioner._id 
        ? { id: newCommissioner._id, ...newCommissioner }
        : newCommissioner;

      const response = await fetch('/api/Commissaires', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh commissioners list from database
        fetchCommissioners();
        
        setNewCommissioner({
          id: null,
          name: "",
          username: "",
          password: "",
          badgeId: "",
          city: "",
          policeStation: "",
          region: "",
          phone: "",
          email: "",
        });
        setShowCommissionerModal(false);
        setShowPassword(false);
        alert("Commissioner saved successfully!");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error('Error saving commissioner:', error);
      alert("Error saving commissioner");
    }
  };

  // Save Station
  const handleSaveStation = async () => {
    if (!newStation.name || !newStation.city) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const method = newStation.id ? 'PUT' : 'POST';
      const body = newStation.id 
        ? { id: newStation.id, ...newStation }
        : { name: newStation.name, city: newStation.city, commander: newStation.commander, officers: newStation.officers };

      const response = await fetch('/api/addstation', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        alert(newStation.id ? "Station modifiée avec succès!" : "Station ajoutée avec succès!");
        // Refresh the stations list
        await fetchStations();
        setNewStation({
          id: null,
          name: "",
          city: "",
          commander: "",
          officers: "",
        });
        setShowStationModal(false);
      } else {
        alert("Erreur: " + result.message);
      }
    } catch (error) {
      console.error('Error saving station:', error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  // Save Complaint
  const handleSaveComplaint = () => {
    if (!newComplaint.name || !newComplaint.cnic || !newComplaint.title || !newComplaint.description) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const now = new Date();
    const submissionDate = now.toISOString().split("T")[0];
    const submissionTime = now.toTimeString().split(" ")[0];

    if (newComplaint.id) {
      setComplaints(
        complaints.map((c) => (c.id === newComplaint.id ? newComplaint : c))
      );
    } else {
      setComplaints([
        ...complaints,
        {
          ...newComplaint,
          id: Date.now(),
          submissionDate,
          submissionTime,
        },
      ]);
    }
    setNewComplaint({
      id: null,
      name: "",
      cnic: "",
      phone: "",
      address: "",
      title: "",
      description: "",
      evidence: "",
      status: "Open",
      submissionDate: "",
      submissionTime: "",
    });
    setShowComplaintModal(false);
  };

  // Save News
  const handleSaveNews = async () => {
    if (!newNews.title || !newNews.description) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const method = newNews.id ? 'PUT' : 'POST';
      const body = newNews.id 
        ? { id: newNews.id, ...newNews }
        : { title: newNews.title, description: newNews.description, image: newNews.image, category: newNews.category, type: newNews.type };

      const response = await fetch('/api/news', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        alert(newNews.id ? "News modifiée avec succès!" : "News ajoutée avec succès!");
        // Refresh the news list
        await fetchNews();
        setNewNews({
          id: null,
          title: "",
          description: "",
          image: "",
          category: "",
          type: "regular",
        });
        setShowNewsModal(false);
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  // Save Alert
  const handleSaveAlert = async () => {
    if (!newAlert.title || !newAlert.location || !newAlert.crime || !newAlert.description) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const method = newAlert._id ? 'PUT' : 'POST';
      const body = newAlert._id 
        ? { id: newAlert._id, ...newAlert }
        : { title: newAlert.title, location: newAlert.location, crime: newAlert.crime, description: newAlert.description };

      const response = await fetch('/api/alert', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        alert(newAlert._id ? "Alerte urgente modifiée avec succès!" : "Alerte urgente ajoutée avec succès!");
        // Refresh the alerts list
        await fetchAlerts();
        setNewAlert({
          id: null,
          title: "",
          location: "",
          crime: "",
          description: "",
        });
        setShowAlertModal(false);
      } else {
        alert("Erreur: " + result.message);
      }
    } catch (error) {
      console.error('Error saving alert:', error);
      alert("Erreur lors de la sauvegarde de l'alerte");
    }
  };

  // Save Awareness Message
  const handleSaveAwareness = async () => {
    if (!newAwareness.title || !newAwareness.description) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const method = newAwareness._id ? 'PUT' : 'POST';
      const body = newAwareness._id 
        ? { id: newAwareness._id, ...newAwareness }
        : { title: newAwareness.title, description: newAwareness.description };

      const response = await fetch('/api/awareness', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        alert(newAwareness._id ? "Message de sensibilisation modifié avec succès!" : "Message de sensibilisation ajouté avec succès!");
        // Refresh the awareness messages list
        await fetchAwarenessMessages();
        setNewAwareness({
          id: null,
          title: "",
          description: "",
        });
        setShowAwarenessModal(false);
      } else {
        alert("Erreur: " + result.message);
      }
    } catch (error) {
      console.error('Error saving awareness message:', error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  // Delete
  const handleDeleteCommissioner = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commissaire?")) {
      try {
        const response = await fetch('/api/Commissaires', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok) {
          // Refresh commissioners list from database
          fetchCommissioners();
          alert("Commissioner deleted successfully!");
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        console.error('Error deleting commissioner:', error);
        alert("Error deleting commissioner");
      }
    }
  };

  const handleDeleteStation = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce commissariat?")) {
      try {
        const response = await fetch('/api/addstation', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Station supprimée avec succès!");
          // Refresh the stations list
          await fetchStations();
        } else {
          alert("Erreur: " + result.message);
        }
      } catch (error) {
        console.error('Error deleting station:', error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteComplaint = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette plainte?")) {
      setComplaints(complaints.filter((c) => c.id !== id));
    }
  };

  const handleDeleteNews = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette nouvelle?")) {
      try {
        const response = await fetch('/api/news', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("News supprimée avec succès!");
          // Refresh the news list
          await fetchNews();
        } else {
          alert("Erreur: " + result.error);
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteAwareness = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce message de sensibilisation?")) {
      try {
        const response = await fetch('/api/awareness', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Message de sensibilisation supprimé avec succès!");
          // Refresh the awareness messages list
          await fetchAwarenessMessages();
        } else {
          alert("Erreur: " + result.message);
        }
      } catch (error) {
        console.error('Error deleting awareness message:', error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteAlert = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette alerte?")) {
      try {
        const response = await fetch('/api/alert', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Alerte urgente supprimée avec succès!");
          // Refresh the alerts list
          await fetchAlerts();
        } else {
          alert("Erreur: " + result.message);
        }
      } catch (error) {
        console.error('Error deleting alert:', error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Reset forms
  const resetCommissionerForm = () => {
    setNewCommissioner({
      id: null,
      name: "",
      username: "",
      password: "",
      badgeId: "",
      city: "",
      policeStation: "",
      region: "",
      phone: "",
      email: "",
    });
    setShowPassword(false);
  };

  const resetStationForm = () => {
    setNewStation({
      id: null,
      name: "",
      city: "",
      commander: "",
      officers: "",
    });
  };

  const resetComplaintForm = () => {
    setNewComplaint({
      id: null,
      name: "",
      cnic: "",
      phone: "",
      address: "",
      title: "",
      description: "",
      evidence: "",
      status: "Open",
      submissionDate: "",
      submissionTime: "",
    });
  };

  const resetNewsForm = () => {
    setNewNews({
      id: null,
      title: "",
      description: "",
      image: "",
      category: "",
      type: "regular",
    });
  };

  const resetAlertForm = () => {
    setNewAlert({
      id: null,
      title: "",
      location: "",
      crime: "",
      createdAt: "",
    });
  };

  const resetAwarenessForm = () => {
    setNewAwareness({
      id: null,
      title: "",
      description: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminname");
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <Image
            src="/logo.jpeg"
            alt="E-OPROGEM Logo"
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <h1 className="text-2xl font-bold">E-OPROGEM</h1>
        </div>
        <div className="flex items-center mb-6 p-3 bg-blue-800 rounded-lg">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-blue-300">Administrateur</p>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center gap-2 ${
              activeSection === "dashboard" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <Home size={18} /> Dashboard
          </button>
          <button
            onClick={() => setActiveSection("commissioners")}
            className={`flex items-center gap-2 ${
              activeSection === "commissioners" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <Users size={18} /> Commissaires
          </button>
          <button
            onClick={() => setActiveSection("stations")}
            className={`flex items-center gap-2 ${
              activeSection === "stations" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <Shield size={18} /> Commissariats
          </button>
          <button
            onClick={() => setActiveSection("complaints")}
            className={`flex items-center gap-2 ${
              activeSection === "complaints" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <FileText size={18} /> Plaintes
          </button>
          <button
            onClick={() => setActiveSection("news")}
            className={`flex items-center gap-2 ${
              activeSection === "news" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <Newspaper size={18} /> News Management
          </button>
          <button
            onClick={() => setActiveSection("awareness")}
            className={`flex items-center gap-2 ${
              activeSection === "awareness" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <MessageSquare size={18} /> Awareness Messages
          </button>
          <button
            onClick={() => setActiveSection("alerts")}
            className={`flex items-center gap-2 ${
              activeSection === "alerts" ? "text-blue-300" : "hover:text-blue-300"
            }`}
          >
            <AlertTriangle size={18} /> Urgent Alerts
          </button>
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-3 text-red-300 hover:text-red-200 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500">Total Commissioners</h3>
                <p className="text-2xl font-bold">{commissioners.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500">Total Police Stations</h3>
                <p className="text-2xl font-bold">{stations.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500">Total Complaints</h3>
                <p className="text-2xl font-bold">{complaints.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500">Total News</h3>
                <p className="text-2xl font-bold">{allNews.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500">Total Awareness Messages</h3>
                <p className="text-2xl font-bold">{awarenessMessages.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500">Total Urgent Alerts</h3>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
            </div>
            
            {/* UrgentAlerts Component */}
            <div className="mb-8">
              <UrgentAlerts />
            </div>
          </>
        )}
        {activeSection === "commissioners" && (
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Commissaires</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Badge ID</th>
                    <th className="p-3 text-left">Commissariat</th>
                    <th className="p-3 text-left">Ville</th>
                    <th className="p-3 text-left">Téléphone</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commissioners.map((c) => (
                    <tr key={c._id || c.id} className="border-b">
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.username}</td>
                      <td className="p-3">{c.badgeId}</td>
                      <td className="p-3">{c.city}</td>
                      <td className="p-3">{c.policeStation}</td>
                      <td className="p-3">{c.region}</td>
                      <td className="p-3">{c.phone}</td>
                      <td className="p-3">{c.email}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setNewCommissioner(c);
                            setShowCommissionerModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteCommissioner(c._id || c.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "stations" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Commissariats</h2>
              <button
                onClick={() => {
                  resetStationForm();
                  setShowStationModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">Ville</th>
                    <th className="p-3 text-left">Commandant</th>
                    <th className="p-3 text-left">Officiers</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.city}</td>
                      <td className="p-3">{s.commander}</td>
                      <td className="p-3">{s.officers}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setNewStation(s);
                            setShowStationModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteStation(s.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "complaints" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Plaintes</h2>
              <button
                onClick={() => {
                  resetComplaintForm();
                  setShowComplaintModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Titre</th>
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">CNIC</th>
                    <th className="p-3 text-left">Téléphone</th>
                    <th className="p-3 text-left">Statut</th>
                    <th className="p-3 text-left">Date de Soumission</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id || c.id} className="border-b">
                      <td className="p-3">{c.title || c.complaintType}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.cnic}</td>
                      <td className="p-3">{c.phone}</td>
                      <td className="p-3">{c.status || 'Pending'}</td>
                      <td className="p-3">{c.submissionDate || new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setNewComplaint(c);
                            setShowComplaintModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteComplaint(c._id || c.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasMoreComplaints && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      const nextPage = complaintsPage + 1;
                      setComplaintsPage(nextPage);
                      fetchComplaints(nextPage, 5);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Load More Complaints
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === "news" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">News Management</h2>
              <button
                onClick={() => {
                  resetNewsForm();
                  setShowNewsModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Titre</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Catégorie</th>
                    <th className="p-3 text-left">Date de Création</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allNews.map((n) => (
                    <tr key={n.id} className="border-b">
                      <td className="p-3">{n.title}</td>
                      <td className="p-3">{n.description?.substring(0, 50)}...</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          n.type === 'headline' ? 'bg-red-100 text-red-800' :
                          n.type === 'banner' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {n.type}
                        </span>
                      </td>
                      <td className="p-3">{n.category}</td>
                      <td className="p-3">{n.createdAt}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setNewNews({
                              id: n.id,
                              title: n.title,
                              description: n.description,
                              image: n.image,
                              category: n.category,
                              type: n.type
                            });
                            setShowNewsModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteNews(n.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "awareness" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Messages de Sensibilisation</h2>
              <button
                onClick={() => {
                  resetAwarenessForm();
                  setShowAwarenessModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Titre</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Date de Création</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {awarenessMessages.map((awareness) => (
                    <tr key={awareness._id || awareness.id} className="border-b">
                      <td className="p-3">{awareness.title}</td>
                      <td className="p-3">{awareness.description?.substring(0, 80)}...</td>
                      <td className="p-3">{new Date(awareness.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setNewAwareness({
                              _id: awareness._id || awareness.id,
                              title: awareness.title,
                              description: awareness.description
                            });
                            setShowAwarenessModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteAwareness(awareness._id || awareness.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "alerts" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Urgent Alerts</h2>
              <button
                onClick={() => {
                  resetAlertForm();
                  setShowAlertModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Titre</th>
                    <th className="p-3 text-left">Lieu</th>
                    <th className="p-3 text-left">Crime</th>
                    <th className="p-3 text-left">Date de Création</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a.id} className="border-b">
                      <td className="p-3">{a.title}</td>
                      <td className="p-3">{a.location}</td>
                      <td className="p-3">{a.crime}</td>
                      <td className="p-3">{a.createdAt}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setNewAlert(a);
                            setShowAlertModal(true);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteAlert(a.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Commissioner Modal */}
        {showCommissionerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {newCommissioner.id ? "Modifier" : "Ajouter"} Commissaire
                </h3>
                <button
                  onClick={() => {
                    setShowCommissionerModal(false);
                    resetCommissionerForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    value={newCommissioner.name}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username *</label>
                  <input
                    type="text"
                    value={newCommissioner.username}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, username: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="j.dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newCommissioner.password}
                      onChange={(e) =>
                        setNewCommissioner({ ...newCommissioner, password: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      placeholder="password123"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Badge ID *</label>
                  <input
                    type="text"
                    value={newCommissioner.badgeId}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, badgeId: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="COM001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={newCommissioner.city}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, city: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Commissariat</label>
                  <select
                    value={newCommissioner.policeStation}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, policeStation: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Sélectionner un commissariat</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.name}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Région</label>
                  <input
                    type="text"
                    value={newCommissioner.region}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, region: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Île-de-France"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newCommissioner.phone}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, phone: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="+33 1 42 60 33 22"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newCommissioner.email}
                    onChange={(e) =>
                      setNewCommissioner({ ...newCommissioner, email: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="j.dupont@police.gov.fr"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowCommissionerModal(false);
                    resetCommissionerForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveCommissioner}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {newCommissioner.id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Station Modal */}
        {showStationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {newStation.id ? "Modifier" : "Ajouter"} Commissariat
                </h3>
                <button
                  onClick={() => {
                    setShowStationModal(false);
                    resetStationForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nom du Commissariat *
                  </label>
                  <input
                    type="text"
                    value={newStation.name}
                    onChange={(e) =>
                      setNewStation({ ...newStation, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Commissariat Central Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={newStation.city}
                    onChange={(e) =>
                      setNewStation({ ...newStation, city: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Commandant
                  </label>
                  <input
                    type="text"
                    value={newStation.commander}
                    onChange={(e) =>
                      setNewStation({ ...newStation, commander: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Nom du commandant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre d'Officiers
                  </label>
                  <input
                    type="number"
                    value={newStation.officers}
                    onChange={(e) =>
                      setNewStation({ ...newStation, officers: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="45"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowStationModal(false);
                    resetStationForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveStation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {newStation.id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Modal */}
        {showComplaintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {newComplaint.id ? "Modifier" : "Ajouter"} Plainte
                </h3>
                <button
                  onClick={() => {
                    setShowComplaintModal(false);
                    resetComplaintForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={newComplaint.title}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Titre de la plainte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    value={newComplaint.name}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="David"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CNIC *</label>
                  <input
                    type="text"
                    value={newComplaint.cnic}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, cnic: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="15899419579"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newComplaint.phone}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, phone: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="699789459944"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <input
                    type="text"
                    value={newComplaint.address}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, address: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="xyz"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={newComplaint.description}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description de la plainte"
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preuve</label>
                  <input
                    type="text"
                    value={newComplaint.evidence}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, evidence: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="image (15).jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    value={newComplaint.status}
                    onChange={(e) =>
                      setNewComplaint({ ...newComplaint, status: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Open">Ouvert</option>
                    <option value="In Progress">En cours</option>
                    <option value="Closed">Fermé</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowComplaintModal(false);
                    resetComplaintForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveComplaint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {newComplaint.id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News Modal */}
        {showNewsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {newNews.id ? "Modifier" : "Ajouter"} Nouvelle
                </h3>
                <button
                  onClick={() => {
                    setShowNewsModal(false);
                    resetNewsForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={newNews.title}
                    onChange={(e) =>
                      setNewNews({ ...newNews, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Titre de la nouvelle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={newNews.type}
                    onChange={(e) =>
                      setNewNews({ ...newNews, type: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="regular">Regular</option>
                    <option value="headline">Headline</option>
                    <option value="banner">Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select
                    value={newNews.category}
                    onChange={(e) =>
                      setNewNews({ ...newNews, category: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Culture">Culture</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Sports">Sports</option>
                    <option value="Education">Education</option>
                    <option value="Economy">Economy</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Politics">Politics</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newNews.image}
                    onChange={(e) =>
                      setNewNews({ ...newNews, image: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={newNews.description}
                    onChange={(e) =>
                      setNewNews({ ...newNews, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description de la nouvelle"
                    rows="4"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowNewsModal(false);
                    resetNewsForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveNews}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {newNews.id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Awareness Modal */}
        {showAwarenessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {newAwareness._id ? "Modifier" : "Ajouter"} Message de Sensibilisation
                </h3>
                <button
                  onClick={() => {
                    setShowAwarenessModal(false);
                    resetAwarenessForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={newAwareness.title}
                    onChange={(e) =>
                      setNewAwareness({ ...newAwareness, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Titre du message de sensibilisation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={newAwareness.description}
                    onChange={(e) =>
                      setNewAwareness({ ...newAwareness, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description du message de sensibilisation"
                    rows="6"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAwarenessModal(false);
                    resetAwarenessForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveAwareness}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {newAwareness._id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {newAlert.id ? "Modifier" : "Ajouter"} Alerte Urgente
                </h3>
                <button
                  onClick={() => {
                    setShowAlertModal(false);
                    resetAlertForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={newAlert.title}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Titre de l'alerte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu *</label>
                  <input
                    type="text"
                    value={newAlert.location}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, location: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Lieu de l'incident"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Crime *</label>
                  <input
                    type="text"
                    value={newAlert.crime}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, crime: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Type de crime"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={newAlert.description}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description détaillée de l'alerte"
                    rows="4"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowAlertModal(false);
                    resetAlertForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveAlert}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {newAlert.id ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
