import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import html2pdf from 'html2pdf.js'
import { 
  Compass, 
  Navigation,
  Calendar, 
  MapPin, 
  CreditCard, 
  Globe, 
  FileText, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Sun, 
  Moon, 
  ArrowRight, 
  Download, 
  Search, 
  Shield, 
  Zap, 
  Clock, 
  Layers,
  Map,
  Hotel,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Star,
  Users,
  Check,
  Bookmark,
  Activity
} from 'lucide-react'
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

    // Dynamic Live Fetch via Wikipedia REST API
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
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = DEFAULT_TRAVEL_IMAGE;
      }}
    />
  );
}

function App() {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState('3')
  const [theme, setTheme] = useState('General Exploration')
  const [budgetLevel, setBudgetLevel] = useState('Medium') 
  const [language, setLanguage] = useState('English')
  const [itinerary, setItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Initializing AI engine...')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('home') // 'home' | 'planner' | 'myTrips'
  const [savedTrips, setSavedTrips] = useState([])
  const [demoDay, setDemoDay] = useState(1)
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [tripToDelete, setTripToDelete] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500); 
  }

  // Dark mode effect
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Fetch saved trips
  useEffect(() => {
    if (activeTab === 'myTrips') fetchSavedTrips();
  }, [activeTab]);

  // Cycling loading text
  useEffect(() => {
    let interval;
    if (isLoading) {
      const messages = [
        "Initializing AI engine...",
        "Calculating neural price prediction...",
        "Structuring daily itinerary...",
        "Finding top stays and recommendations...",
        "Generating flight and location maps...",
        "Finalizing your trip plan..."
      ];
      let i = 0;
      setLoadingText(messages[0]); 
      
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingText(messages[i]);
      }, 2000); 
    } 
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchSavedTrips = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/get-trips');
      const data = await response.json();
      setSavedTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    if (!destination || !days) {
      showToast("Please enter destination and duration.", "danger");
      return;
    }

    setIsLoading(true)
    setItinerary(null) 
    setActiveTab('planner')

    try {
      showToast("Calculating budget forecast...", "primary")
      
      const requestedDays = parseInt(days) || 1;
      let basePrice = requestedDays * 2500 + 500;
      let finalPrice = basePrice;

      if (budgetLevel === 'Low') {
        finalPrice = Math.round(basePrice * 0.6);
      } else if (budgetLevel === 'High') {
        finalPrice = Math.round(basePrice * 2.5);
      }

      const exactBudget = `${budgetLevel} (Estimated Cost: ₹${finalPrice.toLocaleString('en-IN')})`
      showToast(`Estimated budget: ₹${finalPrice.toLocaleString('en-IN')}. Generating itinerary...`, "success")

      // Call Python Backend
      const response = await fetch(`http://127.0.0.1:8000/generate-itinerary?destination=${encodeURIComponent(destination)}&days=${days}&theme=${encodeURIComponent(theme)}&budget_level=${encodeURIComponent(exactBudget)}&language=${encodeURIComponent(language)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error('Network response failed')
      const data = await response.json()
      setItinerary(data.ai_plan || data.message) 
      
    } catch (error) {
      console.error(error)
      setItinerary("Unable to connect to backend server. Please make sure the service is active.")
      showToast("Failed to generate trip itinerary.", "danger")
    } finally {
      setIsLoading(false)
    }
  }

  const quickStartDestination = (destName, themeName) => {
    setDestination(destName);
    setTheme(themeName);
    setDays('3');
    setActiveTab('planner');
    showToast(`Selected ${destName}. Ready to plan!`, "primary");
  }

  const handleSaveTrip = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/save-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination, days: parseInt(days), theme, budget_level: budgetLevel, itinerary
        })
      });
      if (response.ok) showToast("Trip saved to your library.");
    } catch (error) {
      showToast("Failed to save trip.", "danger");
    }
  }

  const handleCopy = () => {
    if (itinerary) {
      navigator.clipboard.writeText(itinerary);
      showToast("Itinerary copied to clipboard.", "success");
    }
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById('itinerary-content');
    const opt = {
      margin: 0.5,
      filename: `${destination.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    showToast("Generating PDF document...", "primary");
    html2pdf().set(opt).from(element).save().then(() => {
      showToast("PDF downloaded successfully.", "success");
    });
  }

  const handleAddToCalendar = () => {
    const eventTitle = encodeURIComponent(`Trip to ${destination}`);
    const eventDetails = encodeURIComponent(`My ${days}-day AI generated trip.\nTheme: ${theme}\nBudget: ${budgetLevel}`);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}`;
    window.open(calendarUrl, '_blank');
    showToast("Opening Google Calendar...", "success");
  }

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

  return (
    <div className={`min-vh-100 d-flex flex-column position-relative ${isDarkMode ? 'app-bg-dark text-white' : 'app-bg-light text-dark'}`}>

      {/* Glass Navigation Header */}
      <header>
        <nav className="navbar navbar-expand-lg sticky-top glass-nav px-3 px-lg-4" style={{ zIndex: 1050 }}>
          <div className="container-fluid max-w-7xl">
            <a 
              className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5 text-gradient cursor-pointer" 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
            >
              <div className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                <Compass size={22} />
              </div>
              <span className="tracking-tight">AI TRIP PLANNER</span>
            </a>

            <div className="d-flex align-items-center gap-2 ms-auto">
              <button 
                className={`nav-pill-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Compass size={16} />
                <span>Home</span>
              </button>

              <button 
                className={`nav-pill-btn ${activeTab === 'planner' ? 'active' : ''}`}
                onClick={() => setActiveTab('planner')}
              >
                <Navigation size={16} />
                <span>Planner</span>
              </button>

              <button 
                className={`nav-pill-btn ${activeTab === 'myTrips' ? 'active' : ''}`}
                onClick={() => setActiveTab('myTrips')}
              >
                <FileText size={16} />
                <span>My Trips</span>
              </button>

              <div className="vr mx-2 opacity-25 d-none d-sm-block" style={{ height: '24px' }}></div>

              <button 
                className="btn btn-outline-secondary rounded-circle p-2 border-0 d-flex align-items-center justify-content-center"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Toggle Theme"
                style={{ width: '38px', height: '38px' }}
              >
                {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-secondary" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-grow-1 container max-w-7xl py-4 py-lg-5 position-relative" style={{ zIndex: 1 }}>
        
        {/* ========================================================== */}
        {/* LANDING PAGE                                                */}
        {/* ========================================================== */}
        {activeTab === 'home' && (
          <div className="animate-fade-up">
            
            {/* HERO SECTION */}
            <section className="py-4 py-lg-5">
              <div className="text-center max-w-3xl mx-auto mb-5">
                <div className="badge-feature mb-3">
                  <Navigation size={14} />
                  <span>Next-Generation Intelligent Travel Engine</span>
                </div>
                <h1 className="fw-extrabold display-3 mb-3 tracking-tight">
                  Intelligent Travel Planning, <span className="text-gradient">Reimagined</span>
                </h1>
                <p className="lead text-muted fs-5 mb-4" style={{ lineHeight: '1.7' }}>
                  Effortlessly build multi-day travel itineraries powered by neural cost forecasting, hotel recommendations, and Google Maps integration.
                </p>
              </div>

              {/* HERO INLINE PLANNER FORM CARD */}
              <div className="glass-card rounded-5 p-4 p-md-5 max-w-4xl mx-auto shadow-2xl mb-5">
                <div className="row g-3">
                  <div className="col-md-5">
                    <div className="form-floating">
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
                  
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="heroDays" 
                        placeholder="Days" 
                        value={days} 
                        onChange={(e) => setDays(e.target.value)} 
                        min="1" 
                      />
                      <label htmlFor="heroDays">Duration (Days)</label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
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

                  <div className="col-md-4">
                    <div className="form-floating">
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
                      </select>
                      <label htmlFor="heroTheme">Travel Theme</label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
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

                  <div className="col-md-4">
                    <button 
                      onClick={handleGenerate}
                      className="btn btn-primary-gradient w-100 h-100 rounded-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                    >
                      <Navigation size={18} />
                      <span>Generate Itinerary</span>
                    </button>
                  </div>
                </div>

                {/* Hero Tech Badges */}
                <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 mt-4 pt-3 border-top border-opacity-10 small text-muted">
                  <span className="d-flex align-items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    Intelligent Budget Forecasting
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    Google Maps & Flights Integration
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <Globe size={16} className="text-info" />
                    7 Languages Supported
                  </span>
                </div>
              </div>
            </section>

            {/* POPULAR DESTINATIONS GRID */}
            <section className="py-5">
              <div className="d-flex align-items-end justify-content-between mb-4">
                <div>
                  <h3 className="fw-bold mb-1">Trending Destinations</h3>
                  <p className="text-muted small mb-0">Select any location to pre-fill your trip planner instantly.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('planner')} 
                  className="btn btn-link text-primary text-decoration-none fw-semibold d-inline-flex align-items-center gap-1 p-0"
                >
                  <span>View All Options</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div 
                    className="glass-card-hover" 
                    onClick={() => quickStartDestination('Udaipur', 'Historical Mysteries')}
                    style={{ position: 'relative', overflow: 'hidden', height: '280px', width: '100%', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#1e293b' }}
                  >
                    <DestinationImage 
                      destName="Udaipur" 
                      alt="Udaipur" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', color: 'white', zIndex: 2 }}>
                      <span className="badge bg-primary bg-opacity-75 rounded-pill w-fit-content mb-2">Heritage & Palaces</span>
                      <h4 className="fw-bold mb-1">Udaipur, Rajasthan</h4>
                      <p className="small mb-0 opacity-80">Royal lakes, historical forts, and cultural walks.</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div 
                    className="glass-card-hover" 
                    onClick={() => quickStartDestination('Manali', 'Scenic Bike Riding')}
                    style={{ position: 'relative', overflow: 'hidden', height: '280px', width: '100%', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#1e293b' }}
                  >
                    <DestinationImage 
                      destName="Manali" 
                      alt="Manali" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', color: 'white', zIndex: 2 }}>
                      <span className="badge bg-primary bg-opacity-75 rounded-pill w-fit-content mb-2">Alpine Peaks</span>
                      <h4 className="fw-bold mb-1">Manali, Himachal</h4>
                      <p className="small mb-0 opacity-80">Mountain passes, valley views, and scenic rides.</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div 
                    className="glass-card-hover" 
                    onClick={() => quickStartDestination('Goa', 'Pure Relaxation')}
                    style={{ position: 'relative', overflow: 'hidden', height: '280px', width: '100%', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#1e293b' }}
                  >
                    <DestinationImage 
                      destName="Goa" 
                      alt="Goa" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', color: 'white', zIndex: 2 }}>
                      <span className="badge bg-primary bg-opacity-75 rounded-pill w-fit-content mb-2">Coastal Relaxation</span>
                      <h4 className="fw-bold mb-1">Goa Beaches</h4>
                      <p className="small mb-0 opacity-80">Sun-kissed coastlines, seafood, and sunset cruises.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE SAMPLE ITINERARY DEMO WIDGET */}
            <section className="py-5">
              <div className="glass-card rounded-5 p-4 p-lg-5">
                <div className="text-center max-w-xl mx-auto mb-4">
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold mb-2">
                    Interactive Preview
                  </span>
                  <h3 className="fw-bold mb-2">What Your Itinerary Looks Like</h3>
                  <p className="text-muted small">Every generated plan comes with flight links, hotel options, daily breakdowns, and Google Maps pins.</p>
                </div>

                {/* Day Tabs */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                  {[1, 2, 3].map((d) => (
                    <button
                      key={d}
                      className={`btn btn-sm rounded-pill px-4 py-2 fw-semibold ${demoDay === d ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setDemoDay(d)}
                    >
                      Day {d} Plan
                    </button>
                  ))}
                </div>

                {/* Sample Content */}
                <div className="p-4 rounded-4 bg-body-tertiary">
                  {demoDay === 1 && (
                    <div className="animate-fade-up">
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                        <h5 className="fw-bold mb-0">Day 1: Arrival & Historic City Core</h5>
                        <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-pill d-inline-flex align-items-center gap-1">
                          <span>Search Flights</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <p className="text-muted small mb-3">
                        Arrive at your destination, check into your stay, and take an evening walking tour around historic landmarks.
                      </p>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="p-3 rounded-3 bg-body border">
                            <div className="fw-semibold small mb-1">Recommended Stay</div>
                            <div className="small text-muted mb-2">Heritage Boutique Resort (Central Location)</div>
                            <a href="https://www.google.com/travel/search" target="_blank" rel="noreferrer" className="text-primary small fw-semibold text-decoration-none d-inline-flex align-items-center gap-1">
                              <span>Book Hotel</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 rounded-3 bg-body border">
                            <div className="fw-semibold small mb-1">Lunch Spot</div>
                            <div className="small text-muted mb-2">Traditional Royal Thali Restaurant</div>
                            <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-primary small fw-semibold text-decoration-none d-inline-flex align-items-center gap-1">
                              <span>Google Maps Location</span>
                              <MapPin size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {demoDay === 2 && (
                    <div className="animate-fade-up">
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                        <h5 className="fw-bold mb-0">Day 2: Deep Exploration & Scenic Sunset</h5>
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">Full Activity Day</span>
                      </div>
                      <p className="text-muted small mb-3">
                        Full day exploring local museum artifacts, taking scenic bike trials, and watching the sunset over panoramic view points.
                      </p>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="p-3 rounded-3 bg-body border">
                            <div className="fw-semibold small mb-1">Morning Activity</div>
                            <div className="small text-muted">Guided heritage walk & palace gallery museum</div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 rounded-3 bg-body border">
                            <div className="fw-semibold small mb-1">Sunset Point</div>
                            <div className="small text-muted">Hilltop observatory & café overlook</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {demoDay === 3 && (
                    <div className="animate-fade-up">
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                        <h5 className="fw-bold mb-0">Day 3: Local Markets & Departure</h5>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-2">Half Day</span>
                      </div>
                      <p className="text-muted small mb-3">
                        Visit local artisan bazaars for souvenirs, enjoy a relaxed brunch, and head to the airport or station.
                      </p>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="p-3 rounded-3 bg-body border">
                            <div className="fw-semibold small mb-1">Artisan Shopping</div>
                            <div className="small text-muted">Local spice market & handicraft stalls</div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 rounded-3 bg-body border">
                            <div className="fw-semibold small mb-1">Farewell Meal</div>
                            <div className="small text-muted">Rooftop Garden Café</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* THREE TECH PILLARS */}
            <section className="py-5">
              <div className="text-center mb-5 max-w-2xl mx-auto">
                <h3 className="fw-bold display-6 mb-2">Powered by Modern Intelligence</h3>
                <p className="text-muted">Combining machine learning price models and generative LLMs for complete travel accuracy.</p>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column">
                    <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary w-fit-content mb-3">
                      <Zap size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">Smart Budget Estimation</h5>
                    <p className="text-muted small flex-grow-1">
                      Predicts accurate travel budget ranges (INR) tailored to your duration and choice of Backpacker, Medium, or Luxury stay.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column">
                    <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary w-fit-content mb-3">
                      <Globe size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">Gemini 2.5 Multi-Lingual</h5>
                    <p className="text-muted small flex-grow-1">
                      Generates complete itineraries in 7 languages (English, Hindi, Gujarati, Marathi, Bengali, Tamil, Telugu).
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="glass-card rounded-4 p-4 h-100 d-flex flex-column">
                    <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary w-fit-content mb-3">
                      <Map size={24} />
                    </div>
                    <h5 className="fw-bold mb-2">Live Maps & Flight Sync</h5>
                    <p className="text-muted small flex-grow-1">
                      Includes clickable Google Maps links for restaurants and search links for flights and accommodations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* REVIEWS & FEEDBACK */}
            <section className="py-5">
              <div className="text-center mb-5 max-w-xl mx-auto">
                <h3 className="fw-bold mb-2">What Travelers Say</h3>
                <p className="text-muted small">Real feedback from users who planned their vacations with AI.</p>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="glass-card rounded-4 p-4 h-100">
                    <div className="d-flex text-warning mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="small text-muted mb-3">
                      "Saved me hours of research for my trip to Manali. The hotel recommendations and budget predictions were spot-on!"
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                        RK
                      </div>
                      <div>
                        <div className="fw-semibold small">Rohit Kumar</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Traveled to Himachal</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="glass-card rounded-4 p-4 h-100">
                    <div className="d-flex text-warning mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="small text-muted mb-3">
                      "Loved that I could get the full itinerary generated in Hindi for my parents. The Google Maps restaurant links made navigating effortless."
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                        PS
                      </div>
                      <div>
                        <div className="fw-semibold small">Priya Sharma</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Traveled to Udaipur</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="glass-card rounded-4 p-4 h-100">
                    <div className="d-flex text-warning mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="small text-muted mb-3">
                      "One-click PDF download and Google Calendar integration made keeping track of our daily itinerary so convenient."
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                        AM
                      </div>
                      <div>
                        <div className="fw-semibold small">Aniket Mehta</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Traveled to Goa</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PRE-FOOTER CTA */}
            <section className="py-4 text-center">
              <div className="p-5 rounded-5 bg-primary bg-gradient text-white position-relative overflow-hidden shadow-xl">
                <h2 className="fw-extrabold mb-3">Ready to Plan Your Next Journey?</h2>
                <p className="lead mb-4 text-white-50">Generate your personalized AI itinerary in seconds.</p>
                <button 
                  className="btn btn-light text-primary btn-lg rounded-pill fw-bold px-5 py-3 shadow"
                  onClick={() => setActiveTab('planner')}
                >
                  Start Planning Free
                </button>
              </div>
            </section>

          </div>
        )}

        {/* ========================================================== */}
        {/* PLANNER TAB                                                 */}
        {/* ========================================================== */}
        {activeTab === 'planner' && (
          <div className="animate-fade-up max-w-4xl mx-auto">
            
            <div className="text-center mb-5">
              <h1 className="fw-extrabold display-5 mb-2">Plan Your Journey</h1>
              <p className="text-muted fs-5">Fill in your travel preferences and let AI build your custom schedule.</p>
            </div>

            {/* Planner Form */}
            <div className="glass-card rounded-5 p-4 p-md-5 mb-5 shadow-lg">
              <form onSubmit={handleGenerate}>
                <div className="row g-4">
                  
                  {/* Destination */}
                  <div className="col-md-8">
                    <div className="form-floating">
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

                  {/* Duration Days */}
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="daysInput" 
                        placeholder="Days" 
                        value={days} 
                        onChange={(e) => setDays(e.target.value)} 
                        min="1" 
                        required 
                      />
                      <label htmlFor="daysInput">Duration (Days)</label>
                    </div>
                  </div>
                  
                  {/* Theme Vibe */}
                  <div className="col-md-4">
                    <div className="form-floating">
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
                      </select>
                      <label htmlFor="themeSelect">Travel Theme & Vibe</label>
                    </div>
                  </div>

                  {/* Budget Level */}
                  <div className="col-md-4">
                    <div className="form-floating">
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
                      <label htmlFor="budgetSelect">Budget Style</label>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="col-md-4">
                    <div className="form-floating">
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
                      <label htmlFor="languageSelect">Output Language</label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary-gradient w-100 btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>{loadingText}</span>
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

            {/* Generated Itinerary Output */}
            {itinerary && (
              <div className="glass-card rounded-5 overflow-hidden shadow-2xl mb-5 animate-fade-up">
                
                {/* Sticky Header Bar */}
                <div className="p-4 bg-primary text-white d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 sticky-top" style={{ top: '65px', zIndex: 10 }}>
                  <div>
                    <h3 className="fw-bold mb-1 text-capitalize">{destination} ({days} Days)</h3>
                    <p className="mb-0 opacity-80 small">{theme} • {budgetLevel} Budget • {language}</p>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      onClick={handleAddToCalendar} 
                      className="btn btn-light text-primary rounded-pill btn-sm fw-semibold d-inline-flex align-items-center gap-2 px-3"
                      title="Add to Google Calendar"
                    >
                      <Calendar size={16} />
                      <span>Calendar</span>
                    </button>

                    <button 
                      onClick={handleDownloadPDF} 
                      className="btn btn-light text-primary rounded-pill btn-sm fw-semibold d-inline-flex align-items-center gap-2 px-3"
                      title="Download PDF"
                    >
                      <Download size={16} />
                      <span>PDF</span>
                    </button>

                    <button 
                      onClick={handleCopy} 
                      className="btn btn-light text-primary rounded-pill btn-sm fw-semibold d-inline-flex align-items-center gap-2 px-3"
                      title="Copy Itinerary"
                    >
                      <Copy size={16} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Destination Cover Photo */}
                <div className="w-100 position-relative rounded-top-5 overflow-hidden" style={{ height: '320px', backgroundColor: '#1e293b' }}>
                  <DestinationImage 
                    destName={destination} 
                    alt={destination} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>

                {/* Itinerary Markdown Body */}
                <div id="itinerary-content" className="p-4 p-md-5">
                  <div className="markdown-body" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                    <Markdown 
                      components={{ 
                        a: ({node, ...props}) => (
                          <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="fw-semibold text-primary text-decoration-none d-inline-flex align-items-center gap-1" 
                            {...props}
                          >
                            <span>{props.children}</span>
                            <ExternalLink size={14} />
                          </a>
                        )
                      }}
                    >
                      {itinerary}
                    </Markdown>
                  </div>
                </div>

                {/* Embedded Interactive Google Map */}
                <div className="w-100 border-top border-bottom" style={{ height: '380px' }}>
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
                
                {/* Save Trip Button Footer */}
                <div className="p-4 text-center">
                  <button 
                    onClick={handleSaveTrip} 
                    className="btn btn-success btn-lg rounded-pill fw-bold px-5 py-3 d-inline-flex align-items-center gap-2 shadow"
                  >
                    <FileText size={20} />
                    <span>Save This Trip to Library</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* MY TRIPS TAB                                                */}
        {/* ========================================================== */}
        {activeTab === 'myTrips' && (
          <div className="animate-fade-up">
            
            <div className="text-center mb-5">
              <h1 className="fw-extrabold display-5 mb-2">Saved Trips Library</h1>
              <p className="text-muted fs-5">Browse and manage your saved travel itineraries.</p>
            </div>

            <div className="row g-4">
              {savedTrips.length > 0 ? (
                savedTrips.map((trip) => (
                  <div className="col-md-6 col-lg-4" key={trip.id}>
                    <div className="glass-card rounded-4 h-100 overflow-hidden d-flex flex-column">
                      
                      {/* Image Header */}
                      <div className="position-relative" style={{ height: '150px', backgroundColor: '#1e293b' }}>
                        <DestinationImage 
                          destName={trip.destination} 
                          alt={trip.destination} 
                          className="w-100 h-100" 
                          style={{ objectFit: 'cover' }} 
                        />
                        <span className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 rounded-pill px-3 py-2">
                          {trip.days} Days
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <h4 className="fw-bold text-capitalize mb-1">{trip.destination}</h4>
                        <div className="text-muted small mb-3">{trip.theme} • {trip.budget_level} Budget</div>

                        <div className="d-flex gap-2 mt-auto pt-3 border-top border-opacity-10">
                          <button 
                            className="btn btn-primary rounded-pill flex-grow-1 fw-semibold btn-sm py-2" 
                            onClick={() => {
                              setItinerary(trip.itinerary); 
                              setDestination(trip.destination); 
                              setDays(trip.days); 
                              setTheme(trip.theme); 
                              setBudgetLevel(trip.budget_level || 'Medium'); 
                              setActiveTab('planner');
                            }}
                          >
                            View Itinerary
                          </button>
                          
                          <button 
                            className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center" 
                            style={{ width: '36px', height: '36px' }}
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
                  <div className="p-4 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex mb-3">
                    <Compass size={48} />
                  </div>
                  <h4 className="fw-bold text-muted">No saved trips found</h4>
                  <p className="text-muted">Start by generating your first itinerary in the planner tab.</p>
                  <button 
                    className="btn btn-primary rounded-pill px-4 py-2 fw-semibold mt-2" 
                    onClick={() => setActiveTab('planner')}
                  >
                    Plan a New Trip
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* FULL LANDING PAGE FOOTER */}
      <footer className="mt-auto border-top glass-nav py-5" style={{ zIndex: 10 }}>
        <div className="container max-w-7xl">
          <div className="row g-4">
            
            {/* Brand & Description */}
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 fw-bold fs-5 text-gradient mb-3">
                <div className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                  <Compass size={20} />
                </div>
                <span>AI TRIP PLANNER</span>
              </div>
              <p className="text-muted small mb-3 max-w-sm" style={{ lineHeight: '1.7' }}>
                Next-generation intelligent travel itinerary generator. Powered by TensorFlow neural price estimation and Gemini 2.5 generative intelligence.
              </p>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1">
                  <span className="animate-pulse-dot bg-success rounded-circle d-inline-block" style={{ width: '6px', height: '6px' }}></span>
                  Systems Operational
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold mb-3">Navigation</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-muted mb-0">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="text-decoration-none text-reset hover-primary">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('planner'); }} className="text-decoration-none text-reset hover-primary">
                    Trip Planner
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('myTrips'); }} className="text-decoration-none text-reset hover-primary">
                    Saved Library
                  </a>
                </li>
              </ul>
            </div>

            {/* Trending Locations */}
            <div className="col-6 col-lg-3">
              <h6 className="fw-bold mb-3">Popular Locations</h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 text-muted mb-0">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); quickStartDestination('Udaipur', 'Historical Mysteries'); }} className="text-decoration-none text-reset">
                    Udaipur Heritage Tour
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); quickStartDestination('Manali', 'Scenic Bike Riding'); }} className="text-decoration-none text-reset">
                    Manali Bike Trails
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); quickStartDestination('Goa', 'Pure Relaxation'); }} className="text-decoration-none text-reset">
                    Goa Coastal Relaxation
                  </a>
                </li>
              </ul>
            </div>

            {/* Microservices Stack */}
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Architecture Stack</h6>
              <div className="d-flex flex-column gap-2 small text-muted">
                <span className="d-flex align-items-center gap-2">
                  <Activity size={14} className="text-success" />
                  FastAPI Python (Port 8000)
                </span>
                <span className="d-flex align-items-center gap-2">
                  <Zap size={14} className="text-primary" />
                  Google Gemini 2.5 LLM Engine
                </span>
                <span className="d-flex align-items-center gap-2">
                  <Layers size={14} className="text-info" />
                  React 19 + Vite Frontend
                </span>
              </div>
            </div>

          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-4 mt-4 border-top border-opacity-10 small text-muted">
            <div>© {new Date().getFullYear()} AI Trip Planner. All rights reserved.</div>
            <div className="mt-2 mt-sm-0">Built with modern web standards and clean vector design.</div>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        <div className={`toast align-items-center text-bg-${toast.type} border-0 rounded-4 shadow-lg ${toast.show ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body fw-semibold p-3 d-flex align-items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{toast.message}</span>
            </div>
            <button type="button" className="btn-close btn-close-white me-3 m-auto" onClick={() => setToast({ ...toast, show: false })} aria-label="Close"></button>
          </div>
        </div>
      </div>

      {/* Delete Modal Confirmation */}
      {tripToDelete && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1100 }}>
          <div className="glass-card rounded-5 p-4 text-center max-w-sm mx-auto shadow-2xl">
            <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex mb-3">
              <AlertTriangle size={32} />
            </div>
            <h4 className="fw-bold mb-2">Delete this trip?</h4>
            <p className="text-muted small mb-4">This action cannot be undone. The itinerary will be permanently removed from your library.</p>
            <div className="d-flex gap-3 justify-content-center">
              <button className="btn btn-light rounded-pill px-4 fw-semibold" onClick={() => setTripToDelete(null)}>Cancel</button>
              <button className="btn btn-danger rounded-pill px-4 fw-semibold shadow" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App