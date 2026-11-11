import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import html2pdf from 'html2pdf.js'
import { 
  Compass, 
  Navigation, 
  FileText, 
  Sun, 
  Moon, 
  Calendar, 
  Download, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  Layers,
  Map,
  Hotel,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Star,
  Activity,
  Plane,
  Sparkles,
  Share2,
  BookmarkCheck,
  Search
} from 'lucide-react'
import './App.css'

const DEFAULT_TRAVEL_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80";

const DESTINATION_IMAGES = {
  udaipur: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=1200&q=80",
  manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
  goa: "https://images.unsplash.com/photo-1512343800234-88253236a21e?auto=format&fit=crop&w=1200&q=80",
  jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  jodhpur: "https://images.unsplash.com/photo-1568402102030-205150423edd?auto=format&fit=crop&w=1200&q=80",
  jaisalmer: "https://images.unsplash.com/photo-1583255448440-410a82b453e0?auto=format&fit=crop&w=1200&q=80",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  munnar: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  alleppey: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  wayanad: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
  agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
  ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
  leh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
  darjeeling: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
  rishikesh: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
  shimla: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
  kolkata: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
  hyderabad: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
};

const imageApiCache = {};

function DestinationImage({ destName, alt, className = "", style = {} }) {
  const [imgSrc, setImgSrc] = useState(() => {
    if (!destName) return DEFAULT_TRAVEL_IMAGE;
    const clean = destName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    for (const key in DESTINATION_IMAGES) {
      if (clean.includes(key) || key.includes(clean)) {
        return DESTINATION_IMAGES[key];
      }
    }
    if (imageApiCache[destName]) return imageApiCache[destName];
    return null;
  });

  useEffect(() => {
    let isMounted = true;
    if (!destName) return;

    const clean = destName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    for (const key in DESTINATION_IMAGES) {
      if (clean.includes(key) || key.includes(clean)) {
        setImgSrc(DESTINATION_IMAGES[key]);
        return;
      }
    }

    if (imageApiCache[destName]) {
      setImgSrc(imageApiCache[destName]);
      return;
    }

    async function fetchWikiImage() {
      try {
        const query = destName.trim();
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          const wikiImg = data.originalimage?.source || data.thumbnail?.source;
          if (wikiImg && isMounted) {
            imageApiCache[destName] = wikiImg;
            setImgSrc(wikiImg);
            return;
          }
        }
      } catch (e) {
        console.warn("Wiki API fetch fallback:", e);
      }
      
      const fallbackUrl = `https://loremflickr.com/1200/600/${encodeURIComponent(destName.trim().replace(/\s+/g, ','))},city,landmark/all`;
      if (isMounted) {
        imageApiCache[destName] = fallbackUrl;
        setImgSrc(fallbackUrl);
      }
    }

    fetchWikiImage();
    return () => { isMounted = false; };
  }, [destName]);

  return (
    <img 
      src={imgSrc || DEFAULT_TRAVEL_IMAGE} 
      alt={alt || destName || "Travel Destination"} 
      className={className} 
      style={style} 
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = DEFAULT_TRAVEL_IMAGE;
      }}
    />
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');
  const [theme, setTheme] = useState('General Exploration');
  const [budgetLevel, setBudgetLevel] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [savedTrips, setSavedTrips] = useState([]);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('horizon_theme') === 'dark';
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'primary' });
  const [backendStatus, setBackendStatus] = useState('checking');

  // Sync Dark Mode with DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('horizon_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Check Backend Health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/health');
        if (res.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkHealth();
  }, []);

  const showToast = (message, type = 'primary') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Status steps during generation
  const loadingMessages = [
    "Exploring flight routes and transit...",
    "Curating boutique accommodations...",
    "Mapping landmarks and culinary stops...",
    "Synthesizing your Horizon Code itinerary..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchSavedTrips = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/get-trips');
      if (response.ok) {
        const data = await response.json();
        setSavedTrips(data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'myTrips') {
      fetchSavedTrips();
    }
  }, [activeTab]);

  const calculateBudgetPreview = (durationDays, budgetTier) => {
    const d = parseInt(durationDays) || 3;
    let base = d * 4500;
    if (budgetTier === 'Low') base = d * 2200;
    if (budgetTier === 'High') base = d * 11500;
    return `₹${Math.round(base * 0.9).toLocaleString('en-IN')} - ₹${Math.round(base * 1.25).toLocaleString('en-IN')}`;
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!destination.trim() || !days) {
      showToast("Please provide both destination and duration.", "danger");
      return;
    }

    const dayNum = parseInt(days);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 30) {
      showToast("Trip duration must be between 1 and 30 days.", "danger");
      return;
    }

    setIsLoading(true);
    setItinerary(null);
    setActiveTab('planner');

    try {
      const response = await fetch('http://127.0.0.1:8000/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          days: dayNum,
          theme,
          budget_level: budgetLevel,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Backend failed to generate itinerary');
      }

      const data = await response.json();
      setItinerary(data.ai_plan);
      showToast(`Itinerary generated for ${destination}!`, "success");
    } catch (err) {
      console.error("Generation error:", err);
      setItinerary(`Unable to connect to backend server. Make sure the FastAPI service is running on Port 8000.`);
      showToast("Could not contact backend service. Please check terminal.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!destination || !itinerary) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/save-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          days: parseInt(days) || 3,
          theme,
          budget_level: budgetLevel,
          itinerary
        })
      });
      if (response.ok) {
        showToast("Trip saved to your Horizon Library!", "success");
        fetchSavedTrips();
      } else {
        showToast("Could not save trip.", "danger");
      }
    } catch (err) {
      showToast("Failed to save trip to library.", "danger");
    }
  };

  const handleCopy = () => {
    if (itinerary) {
      navigator.clipboard.writeText(itinerary);
      showToast("Itinerary copied to clipboard!", "success");
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('itinerary-content');
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: `${destination.toLowerCase().replace(/\s+/g, '-')}-horizon-itinerary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    showToast("Generating PDF document...", "primary");
    html2pdf().set(opt).from(element).save().then(() => {
      showToast("PDF downloaded successfully!", "success");
    });
  };

  const handleAddToCalendar = () => {
    const eventTitle = encodeURIComponent(`Trip to ${destination} (Horizon Code)`);
    const eventDetails = encodeURIComponent(`Travel Itinerary for ${destination}\nDuration: ${days} Days\nTheme: ${theme}\nBudget: ${budgetLevel}`);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}`;
    window.open(calendarUrl, '_blank');
    showToast("Opening Google Calendar...", "success");
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete-trip/${tripToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSavedTrips();
        showToast("Trip removed from library.", "secondary");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
    setTripToDelete(null);
  };

  const quickStartDestination = (destName, themeName) => {
    setDestination(destName);
    setTheme(themeName);
    setDays('3');
    setActiveTab('planner');
    showToast(`Loaded ${destName}. Ready to generate!`, "primary");
  };

  const filteredTrips = savedTrips.filter(t => 
    t.destination?.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
    t.theme?.toLowerCase().includes(savedSearchQuery.toLowerCase())
  );

  return (
    <div className={`min-vh-100 d-flex flex-column position-relative ${isDarkMode ? 'app-atmosphere-dark text-white' : 'app-atmosphere-light'}`}>
      
      {/* ========================================================== */}
      {/* HORIZON CODE NAVIGATION HEADER                             */}
      {/* ========================================================== */}
      <header className="sticky-top" style={{ zIndex: 1040 }}>
        <nav className="horizon-nav px-3 px-lg-4 py-3">
          <div className="container-fluid max-w-7xl d-flex align-items-center justify-content-between">
            
            {/* Brand Logo & Tagline */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} 
              className="d-flex align-items-center gap-2 text-decoration-none"
            >
              <div 
                className="d-flex align-items-center justify-content-center text-white shadow-sm"
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1F3570 0%, #3E64B0 60%, #7FA6E0 100%)'
                }}
              >
                <Compass size={22} color="#FFF6E8" />
              </div>
              <div>
                <div className="font-display fw-bold fs-5 tracking-tight text-horizon-gradient mb-0 line-height-1">
                  HORIZON CODE
                </div>
                <div className="small text-muted d-none d-sm-block" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                  INTELLIGENT TRAVEL SUITE
                </div>
              </div>
            </a>

            {/* Navigation Tabs */}
            <div className="d-flex align-items-center gap-1 gap-md-2">
              <button 
                className={`horizon-nav-pill ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Compass size={16} />
                <span>Home</span>
              </button>

              <button 
                className={`horizon-nav-pill ${activeTab === 'planner' ? 'active' : ''}`}
                onClick={() => setActiveTab('planner')}
              >
                <Navigation size={16} />
                <span>Planner</span>
              </button>

              <button 
                className={`horizon-nav-pill ${activeTab === 'myTrips' ? 'active' : ''}`}
                onClick={() => setActiveTab('myTrips')}
              >
                <FileText size={16} />
                <span>My Trips</span>
                {savedTrips.length > 0 && (
                  <span className="badge rounded-pill bg-white text-dark ms-1 px-2" style={{ fontSize: '0.7rem' }}>
                    {savedTrips.length}
                  </span>
                )}
              </button>

              <div className="vr mx-2 opacity-25 d-none d-sm-block" style={{ height: '24px' }}></div>

              {/* Theme Toggle Button */}
              <button 
                className="btn btn-horizon-outline rounded-circle p-2 d-flex align-items-center justify-content-center"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? "Switch to Sunrise Light" : "Switch to Horizon Night"}
                style={{ width: '40px', height: '40px', padding: 0 }}
              >
                {isDarkMode ? <Sun size={18} color="#FFF6E8" /> : <Moon size={18} color="#1F3570" />}
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* ========================================================== */}
      {/* MAIN CONTENT REGION                                        */}
      {/* ========================================================== */}
      <main className="flex-grow-1 container max-w-7xl py-4 py-lg-5 position-relative" style={{ zIndex: 1 }}>

        {/* ========================================================== */}
        {/* TAB 1: HOME / LANDING VIEW                                 */}
        {/* ========================================================== */}
        {activeTab === 'home' && (
          <div className="animate-horizon-fade">
            
            {/* HERO BANNER SECTION */}
            <section className="py-4 py-lg-5 text-center position-relative">
              
              {/* Reference Color Palette Card (Horizon Code Showcase) */}
              <div className="d-inline-flex align-items-center gap-2 horizon-card px-4 py-2 mb-4 border border-1 shadow-sm">
                <span className="animate-horizon-pulse rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#3E64B0' }}></span>
                <span className="small fw-bold tracking-wider" style={{ color: 'var(--text-heading)', fontSize: '0.8rem' }}>
                  HORIZON CODE AESTHETIC:
                </span>
                <div className="d-flex align-items-center gap-1 ms-1">
                  {['#0B1430', '#1F3570', '#3E64B0', '#7FA6E0', '#C9DDF5', '#FFF6E8'].map((c, i) => (
                    <span 
                      key={i} 
                      title={c} 
                      className="rounded-circle border border-white shadow-xs" 
                      style={{ width: '14px', height: '14px', backgroundColor: c, display: 'inline-block' }}
                    />
                  ))}
                </div>
              </div>

              {/* Headline */}
              <h1 className="display-3 fw-bold mb-3 font-display tracking-tight text-horizon-gradient">
                A Wide Sky Waiting to be Written.
              </h1>
              <p className="lead max-w-2xl mx-auto mb-5 text-muted" style={{ lineHeight: '1.7', fontSize: '1.2rem' }}>
                Generate intelligent multi-day travel itineraries with real-time budget forecasting, authentic stays, and integrated map routes.
              </p>

              {/* HERO QUICK PLANNER CARD */}
              <div className="horizon-card max-w-4xl mx-auto p-4 p-md-5 mb-5 text-start shadow-lg">
                <div className="row g-3">
                  
                  {/* Destination Input */}
                  <div className="col-md-5">
                    <div className="horizon-form-floating form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="heroDest" 
                        placeholder="Where to?" 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                      />
                      <label htmlFor="heroDest">Where are you going?</label>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="col-md-3">
                    <div className="horizon-form-floating form-floating">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="heroDays" 
                        placeholder="Days" 
                        value={days} 
                        onChange={(e) => setDays(e.target.value)} 
                        min="1" 
                        max="30"
                      />
                      <label htmlFor="heroDays">Duration (Days)</label>
                    </div>
                  </div>

                  {/* Budget Level */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <select 
                        className="form-select" 
                        id="heroBudget" 
                        value={budgetLevel} 
                        onChange={(e) => setBudgetLevel(e.target.value)}
                      >
                        <option value="Low">Low (Backpacker)</option>
                        <option value="Medium">Medium (Balanced)</option>
                        <option value="High">High (Luxury)</option>
                      </select>
                      <label htmlFor="heroBudget">Budget Style</label>
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <select 
                        className="form-select" 
                        id="heroTheme" 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="General Exploration">General Exploration</option>
                        <option value="Historical Mysteries">Historical Mysteries</option>
                        <option value="Cultural Heritage">Cultural Heritage</option>
                        <option value="Scenic Bike Riding">Scenic Bike Riding</option>
                        <option value="Pure Relaxation">Pure Relaxation</option>
                        <option value="Food & Culinary Tour">Food & Culinary Tour</option>
                      </select>
                      <label htmlFor="heroTheme">Travel Vibe</label>
                    </div>
                  </div>

                  {/* Output Language */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <select 
                        className="form-select" 
                        id="heroLang" 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                      </select>
                      <label htmlFor="heroLang">Language</label>
                    </div>
                  </div>

                  {/* CTA Generate */}
                  <div className="col-md-4">
                    <button 
                      onClick={handleGenerate}
                      className="btn-horizon-primary w-100 h-100 py-3"
                    >
                      <Sparkles size={18} />
                      <span>Plan This Journey</span>
                    </button>
                  </div>

                </div>

                {/* Features Under Hero Card */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-4 border-top border-opacity-10 small text-muted">
                  <span className="d-flex align-items-center gap-2">
                    <Zap size={16} color="#3E64B0" />
                    Intelligent Budget Forecasting (₹ INR)
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <Plane size={16} color="#7FA6E0" />
                    Google Flights & Stays Search
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <Map size={16} color="#1F3570" />
                    Google Maps Link Integration
                  </span>
                </div>
              </div>

            </section>

            {/* POPULAR DESTINATIONS GRID */}
            <section className="py-4">
              <div className="d-flex align-items-end justify-content-between mb-4">
                <div>
                  <span className="horizon-badge mb-2">CURATED DESTINATIONS</span>
                  <h2 className="display-6 fw-bold mb-1">Trending Expeditions</h2>
                  <p className="text-muted small mb-0">Select any card to automatically pre-configure your trip details.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('planner')} 
                  className="btn-horizon-outline btn-sm"
                >
                  <span>Open Full Planner</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="row g-4">
                
                {/* Destination 1: Udaipur */}
                <div className="col-md-6 col-lg-4">
                  <div 
                    className="horizon-card horizon-card-hover overflow-hidden cursor-pointer position-relative" 
                    style={{ height: '300px' }}
                    onClick={() => quickStartDestination('Udaipur', 'Historical Mysteries')}
                  >
                    <DestinationImage 
                      destName="Udaipur" 
                      alt="Udaipur" 
                      className="horizon-dest-img position-absolute top-0 start-0 w-100 h-100" 
                    />
                    <div 
                      className="position-absolute inset-0 d-flex flex-column justify-content-end p-4 text-white"
                      style={{ 
                        background: 'linear-gradient(to top, rgba(11, 20, 48, 0.95) 0%, rgba(11, 20, 48, 0.3) 65%, transparent 100%)',
                        zIndex: 2 
                      }}
                    >
                      <span className="horizon-badge horizon-badge-primary w-fit-content mb-2">Heritage & Palaces</span>
                      <h4 className="fw-bold mb-1 text-white">Udaipur, Rajasthan</h4>
                      <p className="small mb-0 opacity-80" style={{ color: '#C9DDF5' }}>Lakeside palaces, regal forts, and sunset boat rides.</p>
                    </div>
                  </div>
                </div>

                {/* Destination 2: Manali */}
                <div className="col-md-6 col-lg-4">
                  <div 
                    className="horizon-card horizon-card-hover overflow-hidden cursor-pointer position-relative" 
                    style={{ height: '300px' }}
                    onClick={() => quickStartDestination('Manali', 'Scenic Bike Riding')}
                  >
                    <DestinationImage 
                      destName="Manali" 
                      alt="Manali" 
                      className="horizon-dest-img position-absolute top-0 start-0 w-100 h-100" 
                    />
                    <div 
                      className="position-absolute inset-0 d-flex flex-column justify-content-end p-4 text-white"
                      style={{ 
                        background: 'linear-gradient(to top, rgba(11, 20, 48, 0.95) 0%, rgba(11, 20, 48, 0.3) 65%, transparent 100%)',
                        zIndex: 2 
                      }}
                    >
                      <span className="horizon-badge horizon-badge-primary w-fit-content mb-2">Himalayan Trails</span>
                      <h4 className="fw-bold mb-1 text-white">Manali, Himachal</h4>
                      <p className="small mb-0 opacity-80" style={{ color: '#C9DDF5' }}>Alpine passes, apple orchards, and mountain trail rides.</p>
                    </div>
                  </div>
                </div>

                {/* Destination 3: Goa */}
                <div className="col-md-6 col-lg-4">
                  <div 
                    className="horizon-card horizon-card-hover overflow-hidden cursor-pointer position-relative" 
                    style={{ height: '300px' }}
                    onClick={() => quickStartDestination('Goa', 'Pure Relaxation')}
                  >
                    <DestinationImage 
                      destName="Goa" 
                      alt="Goa" 
                      className="horizon-dest-img position-absolute top-0 start-0 w-100 h-100" 
                    />
                    <div 
                      className="position-absolute inset-0 d-flex flex-column justify-content-end p-4 text-white"
                      style={{ 
                        background: 'linear-gradient(to top, rgba(11, 20, 48, 0.95) 0%, rgba(11, 20, 48, 0.3) 65%, transparent 100%)',
                        zIndex: 2 
                      }}
                    >
                      <span className="horizon-badge horizon-badge-primary w-fit-content mb-2">Coastal Serenity</span>
                      <h4 className="fw-bold mb-1 text-white">Goa Coastline</h4>
                      <p className="small mb-0 opacity-80" style={{ color: '#C9DDF5' }}>Golden beaches, Portuguese heritage, and seafood dining.</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* THREE ARCHITECTURE PILLARS */}
            <section className="py-5">
              <div className="text-center mb-5 max-w-2xl mx-auto">
                <span className="horizon-badge mb-2">INTELLIGENT FOUNDATION</span>
                <h3 className="display-6 fw-bold mb-2">The Horizon Standard</h3>
                <p className="text-muted">Designed for travel precision, fast execution, and delightful simplicity.</p>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="horizon-card p-4 h-100 d-flex flex-column">
                    <div className="p-3 rounded-4 w-fit-content mb-3" style={{ background: 'rgba(62, 100, 176, 0.15)', color: '#3E64B0' }}>
                      <Zap size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">Neural Cost Estimation</h5>
                    <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.7' }}>
                      Accurately calculates tiered budgets in ₹ (INR) including accommodations, dining, local transit, and activities for custom durations.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="horizon-card p-4 h-100 d-flex flex-column">
                    <div className="p-3 rounded-4 w-fit-content mb-3" style={{ background: 'rgba(31, 53, 112, 0.15)', color: '#1F3570' }}>
                      <MapPin size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">Live Map & Flight Sync</h5>
                    <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.7' }}>
                      Provides one-click search for Google Flights and Google Maps search links for every restaurant and local heritage attraction.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="horizon-card p-4 h-100 d-flex flex-column">
                    <div className="p-3 rounded-4 w-fit-content mb-3" style={{ background: 'rgba(127, 166, 224, 0.2)', color: '#3E64B0' }}>
                      <FileText size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">1-Click PDF & Calendar</h5>
                    <p className="text-muted small flex-grow-1" style={{ lineHeight: '1.7' }}>
                      Export crisp PDF itineraries for offline travel or sync directly to Google Calendar with structured daily schedule events.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: TRIP PLANNER VIEW                                   */}
        {/* ========================================================== */}
        {activeTab === 'planner' && (
          <div className="animate-horizon-fade max-w-4xl mx-auto">
            
            <div className="text-center mb-5">
              <span className="horizon-badge mb-2">TRIP ARCHITECT</span>
              <h1 className="display-5 fw-bold mb-2">Plan Your Custom Journey</h1>
              <p className="text-muted fs-5">Configure your destination, pace, and style. Our engine handles the rest.</p>
            </div>

            {/* FORM CONSOLE */}
            <div className="horizon-card p-4 p-md-5 mb-5 shadow-lg">
              <form onSubmit={handleGenerate}>
                <div className="row g-4">
                  
                  {/* Destination - Tested by Selenium test_ui.py (ID: destInput) */}
                  <div className="col-md-8">
                    <div className="horizon-form-floating form-floating">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="destInput" 
                        placeholder="e.g. Udaipur, Manali, Kyoto..." 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)} 
                        required 
                      />
                      <label htmlFor="destInput">Destination Location</label>
                    </div>
                  </div>

                  {/* Duration - Tested by Selenium test_ui.py (ID: daysInput) */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="daysInput" 
                        placeholder="Days" 
                        value={days} 
                        onChange={(e) => setDays(e.target.value)} 
                        min="1" 
                        max="30"
                        required 
                      />
                      <label htmlFor="daysInput">Duration (Days)</label>
                    </div>
                  </div>

                  {/* Budget Select - Tested by Selenium test_ui.py (ID: budgetSelect) */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <select 
                        className="form-select" 
                        id="budgetSelect" 
                        value={budgetLevel} 
                        onChange={(e) => setBudgetLevel(e.target.value)}
                      >
                        <option value="Low">Low (Backpacker)</option>
                        <option value="Medium">Medium (Balanced)</option>
                        <option value="High">High (Luxury)</option>
                      </select>
                      <label htmlFor="budgetSelect">Budget Tier</label>
                    </div>
                  </div>

                  {/* Theme Select */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <select 
                        className="form-select" 
                        id="themeSelect" 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="General Exploration">General Exploration</option>
                        <option value="Historical Mysteries">Historical Mysteries</option>
                        <option value="Cultural Heritage">Cultural Heritage</option>
                        <option value="Scenic Bike Riding">Scenic Bike Riding</option>
                        <option value="Pure Relaxation">Pure Relaxation</option>
                        <option value="Food & Culinary Tour">Food & Culinary Tour</option>
                      </select>
                      <label htmlFor="themeSelect">Travel Theme</label>
                    </div>
                  </div>

                  {/* Language Select */}
                  <div className="col-md-4">
                    <div className="horizon-form-floating form-floating">
                      <select 
                        className="form-select" 
                        id="languageSelect" 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                      </select>
                      <label htmlFor="languageSelect">Language</label>
                    </div>
                  </div>

                  {/* Live Budget Preview Pill */}
                  <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-4" style={{ background: 'var(--hc-cloud-mist)', color: '#0B1430' }}>
                      <div className="d-flex align-items-center gap-2">
                        <Zap size={18} color="#1F3570" />
                        <span className="small fw-semibold">Estimated Budget Forecast ({days} Days, {budgetLevel}):</span>
                      </div>
                      <div className="fw-bold font-display" style={{ color: '#0B1430' }}>
                        {calculateBudgetPreview(days, budgetLevel)}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - Tested by Selenium test_ui.py */}
                  <div className="col-12 mt-2">
                    <button 
                      type="submit" 
                      className="btn-horizon-primary w-100 py-3 fs-5"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span>{loadingMessages[loadingStep]}</span>
                        </>
                      ) : (
                        <>
                          <Navigation size={20} />
                          <span>Generate Travel Itinerary</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>

            {/* GENERATED ITINERARY DISPLAY */}
            {itinerary && (
              <div className="horizon-card overflow-hidden shadow-2xl mb-5 animate-horizon-fade">
                
                {/* Action Header Bar */}
                <div 
                  className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 sticky-top"
                  style={{ 
                    top: '72px', 
                    zIndex: 20, 
                    background: 'linear-gradient(135deg, #0B1430 0%, #1F3570 100%)',
                    color: '#FFF6E8',
                    borderBottom: '1px solid rgba(127, 166, 224, 0.3)'
                  }}
                >
                  <div>
                    <h3 className="fw-bold mb-1 text-capitalize" style={{ color: '#FFF6E8' }}>
                      {destination} • {days} Days
                    </h3>
                    <div className="small opacity-80" style={{ color: '#C9DDF5' }}>
                      {theme} • {budgetLevel} Tier • {language}
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <button 
                      onClick={handleAddToCalendar} 
                      className="btn-horizon-cream btn-sm"
                      title="Add to Google Calendar"
                    >
                      <Calendar size={15} />
                      <span>Calendar</span>
                    </button>

                    <button 
                      onClick={handleDownloadPDF} 
                      className="btn-horizon-cream btn-sm"
                      title="Download PDF"
                    >
                      <Download size={15} />
                      <span>Export PDF</span>
                    </button>

                    <button 
                      onClick={handleCopy} 
                      className="btn-horizon-cream btn-sm"
                      title="Copy Itinerary Text"
                    >
                      <Copy size={15} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Destination Cover Photo */}
                <div className="w-100 position-relative" style={{ height: '320px', backgroundColor: '#0B1430' }}>
                  <DestinationImage 
                    destName={destination} 
                    alt={destination} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                  />
                  <div 
                    className="position-absolute bottom-0 start-0 end-0 p-4" 
                    style={{ background: 'linear-gradient(to top, rgba(11, 20, 48, 0.9) 0%, transparent 100%)' }}
                  >
                    <span className="horizon-badge horizon-badge-primary">
                      {destination} Travel Schedule
                    </span>
                  </div>
                </div>

                {/* Markdown Content - Tested by Selenium test_ui.py (ID: itinerary-content) */}
                <div id="itinerary-content" className="p-4 p-md-5">
                  <div className="horizon-markdown">
                    <Markdown 
                      components={{
                        a: ({node, ...props}) => (
                          <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="d-inline-flex align-items-center gap-1"
                            {...props}
                          >
                            <span>{props.children}</span>
                            <ExternalLink size={13} />
                          </a>
                        )
                      }}
                    >
                      {itinerary}
                    </Markdown>
                  </div>
                </div>

                {/* Interactive Map Embed */}
                <div className="w-100 border-top border-bottom" style={{ height: '360px' }}>
                  <iframe
                    title={`Map of ${destination}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>

                {/* Save Trip Footer */}
                <div className="p-4 text-center" style={{ background: 'var(--bg-surface-elevated)' }}>
                  <button 
                    onClick={handleSaveTrip} 
                    className="btn-horizon-primary px-5 py-3 fs-5"
                  >
                    <BookmarkCheck size={20} />
                    <span>Save This Trip to Library</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: MY TRIPS / SAVED LIBRARY                            */}
        {/* ========================================================== */}
        {activeTab === 'myTrips' && (
          <div className="animate-horizon-fade">
            
            <div className="text-center mb-4">
              <span className="horizon-badge mb-2">PERSONAL ARCHIVE</span>
              <h1 className="display-5 fw-bold mb-2">Saved Trips Library</h1>
              <p className="text-muted fs-5">Access your past generated itineraries anytime.</p>
            </div>

            {/* Search Filter Bar */}
            <div className="max-w-md mx-auto mb-5">
              <div className="input-group horizon-card p-1 shadow-sm">
                <span className="input-group-text bg-transparent border-0 ps-3">
                  <Search size={18} color="var(--text-muted)" />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none text-heading" 
                  placeholder="Filter saved trips by destination or theme..." 
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="row g-4">
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <div className="col-md-6 col-lg-4" key={trip.id}>
                    <div className="horizon-card h-100 overflow-hidden d-flex flex-column">
                      
                      {/* Image Thumbnail */}
                      <div className="position-relative" style={{ height: '180px', backgroundColor: '#0B1430' }}>
                        <DestinationImage 
                          destName={trip.destination} 
                          alt={trip.destination} 
                          className="horizon-dest-img" 
                        />
                        <span 
                          className="position-absolute top-0 end-0 m-3 horizon-badge"
                          style={{ backgroundColor: 'rgba(11, 20, 48, 0.85)', color: '#FFF6E8', border: 'none' }}
                        >
                          {trip.days} Days
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <h4 className="fw-bold text-capitalize mb-1">{trip.destination}</h4>
                        <div className="text-muted small mb-3">
                          {trip.theme} • {trip.budget_level} Tier
                        </div>

                        {/* Actions */}
                        <div className="d-flex align-items-center gap-2 mt-auto pt-3 border-top border-opacity-10">
                          <button 
                            className="btn-horizon-primary flex-grow-1 py-2 btn-sm"
                            onClick={() => {
                              setDestination(trip.destination);
                              setDays(trip.days.toString());
                              setTheme(trip.theme);
                              setBudgetLevel(trip.budget_level || 'Medium');
                              setItinerary(trip.itinerary);
                              setActiveTab('planner');
                              showToast(`Loaded ${trip.destination} itinerary!`, "primary");
                            }}
                          >
                            <span>View Itinerary</span>
                          </button>

                          <button 
                            className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{ width: '38px', height: '38px' }}
                            onClick={() => setTripToDelete(trip.id)}
                            title="Delete Trip"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div 
                    className="p-4 rounded-circle d-inline-flex mb-3"
                    style={{ background: 'var(--hc-cloud-mist)', color: '#1F3570' }}
                  >
                    <Compass size={48} />
                  </div>
                  <h4 className="fw-bold mb-2">No Saved Trips Found</h4>
                  <p className="text-muted mb-4">
                    {savedSearchQuery ? "No trips matched your search filter." : "Start by generating your first custom travel schedule in the planner."}
                  </p>
                  <button 
                    className="btn-horizon-primary" 
                    onClick={() => setActiveTab('planner')}
                  >
                    Create a New Itinerary
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================== */}
      {/* FOOTER                                                     */}
      {/* ========================================================== */}
      <footer 
        className="mt-auto py-5 border-top"
        style={{ 
          background: isDarkMode ? '#070D21' : '#FFF6E8', 
          borderColor: 'var(--border-subtle)' 
        }}
      >
        <div className="container max-w-7xl">
          <div className="row g-4">
            
            {/* Branding Column */}
            <div className="col-lg-5">
              <div className="d-flex align-items-center gap-2 fw-bold fs-5 text-horizon-gradient mb-2">
                <div 
                  className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center"
                  style={{ background: '#3E64B0', width: '36px', height: '36px' }}
                >
                  <Compass size={20} color="#FFF6E8" />
                </div>
                <span>HORIZON CODE</span>
              </div>
              <p className="text-muted small mb-3 max-w-sm" style={{ lineHeight: '1.7' }}>
                A wide sky waiting to be written. Engineered for seamless multi-day travel itineraries, budget intelligence, and Google Maps integration.
              </p>
              
              {/* System status pill */}
              <div className="d-inline-flex align-items-center gap-2 horizon-badge">
                <span 
                  className="rounded-circle d-inline-block" 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: backendStatus === 'connected' ? '#10b981' : '#f59e0b' 
                  }}
                ></span>
                <span>FastAPI Backend: {backendStatus === 'connected' ? 'Connected (Port 8000)' : 'Standby / Local'}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-6 col-lg-3">
              <h6 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>Navigation</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-muted mb-0">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="text-decoration-none text-reset">
                    Home Portal
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('planner'); }} className="text-decoration-none text-reset">
                    Travel Planner
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('myTrips'); }} className="text-decoration-none text-reset">
                    Trip Archive
                  </a>
                </li>
              </ul>
            </div>

            {/* Architecture Stack */}
            <div className="col-6 col-lg-4">
              <h6 className="fw-bold mb-3" style={{ color: 'var(--text-heading)' }}>Horizon Tech Stack</h6>
              <div className="d-flex flex-column gap-2 small text-muted">
                <span className="d-flex align-items-center gap-2">
                  <Activity size={14} color="#3E64B0" />
                  FastAPI Python & SQLite Database
                </span>
                <span className="d-flex align-items-center gap-2">
                  <Zap size={14} color="#7FA6E0" />
                  Gemini LLM & Horizon Smart Planner
                </span>
                <span className="d-flex align-items-center gap-2">
                  <Layers size={14} color="#1F3570" />
                  React 19, Vite & Bootstrap 5
                </span>
              </div>
            </div>

          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-4 mt-4 border-top border-opacity-10 small text-muted">
            <div>© {new Date().getFullYear()} Horizon Code. Color Palette: #0B1430, #1F3570, #3E64B0, #7FA6E0, #C9DDF5, #FFF6E8.</div>
            <div className="mt-2 mt-sm-0">All itineraries generated with intelligent travel forecasting.</div>
          </div>
        </div>
      </footer>

      {/* ========================================================== */}
      {/* FLOATING TOAST NOTIFICATION CONTAINER                      */}
      {/* ========================================================== */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        <div 
          className={`toast align-items-center border-0 rounded-4 shadow-lg ${toast.show ? 'show' : 'hide'}`} 
          style={{ 
            background: 'var(--hc-deep-navy)', 
            color: '#FFF6E8',
            border: '1px solid rgba(127, 166, 224, 0.4)' 
          }}
          role="alert"
        >
          <div className="d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center gap-2 fw-semibold">
              <CheckCircle2 size={18} color="#7FA6E0" />
              <span>{toast.message}</span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white ms-3" 
              onClick={() => setToast({ ...toast, show: false })} 
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* DELETE MODAL CONFIRMATION                                  */}
      {/* ========================================================== */}
      {tripToDelete && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(11, 20, 48, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1200 }}
        >
          <div className="horizon-card p-4 text-center max-w-sm mx-auto shadow-2xl">
            <div 
              className="p-3 rounded-circle d-inline-flex mb-3"
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}
            >
              <AlertTriangle size={32} />
            </div>
            <h4 className="fw-bold mb-2">Delete this trip?</h4>
            <p className="text-muted small mb-4">
              This action cannot be undone. The itinerary will be removed from your Horizon Library.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button 
                className="btn-horizon-outline px-4 btn-sm" 
                onClick={() => setTripToDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger rounded-pill px-4 btn-sm fw-bold shadow" 
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
