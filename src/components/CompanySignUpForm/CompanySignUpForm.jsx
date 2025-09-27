import React, { useState, useEffect } from 'react';
import './CompanySignUpForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { assets } from '../../assets/assets'; // adapte le chemin si besoin

// Fix icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CompanySignUpForm = ({ onClose, captchaToken, setCaptchaToken, captchaRef }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    category: "",
    founded: "",
    size: "",
    location: "",
    website: "",
    linkedin: "",
    lat: "",
    lng: ""
  });
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  const categories = [
    "Tech",
    "Advertising&Marketing",
    "Culture&Media",
    "Consulting&Audit",
    "Education&Training",
    "Finance&Banking"
  ];

  // Fetch plans when component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:7001/api/auth/plans");
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Failed to load plans');
      }
    };
    fetchPlans();
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (step === 1 && (!formData.username || !formData.email || !formData.password)) {
      toast.error("Please fill all fields before continuing");
      return;
    }
    if (step === 2 && (!formData.category || !formData.founded)) {
      toast.error("Please complete company details");
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // 📍 Clic sur la carte
  const handleMapClick = ({ lat, lng }) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }));
  };

  // Leaflet LocationPicker
  const LocationPicker = ({ lat, lng }) => {
    const MapEvents = () => {
      useMapEvents({
        click(e) {
          handleMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
      });
      return null;
    };

    return (
      <MapContainer
        center={[lat || 36.81897, lng || 10.16579]}
        zoom={12}
        key={`${lat}-${lng}`}
        className="csf-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {lat && lng && (
          <Marker
            position={[lat, lng]}
            draggable={true}
            eventHandlers={{
              dragend: e =>
                handleMapClick({
                  lat: e.target.getLatLng().lat,
                  lng: e.target.getLatLng().lng,
                }),
            }}
          />
        )}
        <MapEvents />
      </MapContainer>
    );
  };

  // 🔎 Recherche d'adresse avec Nominatim
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await res.json();
      if (results.length === 0) return toast.warning('Location not found');

      const { lat, lon, display_name } = results[0];
      setFormData(prev => ({
        ...prev,
        lat: parseFloat(lat),
        lng: parseFloat(lon),
        location: display_name,
      }));

      toast.success('Location updated on map!');
    } catch (err) {
      console.error(err);
      toast.error('Error searching location.');
    }
  };

  // Handle payment and registration
  const handlePayment = async (planId) => {
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }

    setLoading(true);

    try {
      const coordinates = formData.lat && formData.lng ? {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      } : null;

      const response = await fetch("http://localhost:7001/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "company",
          captchaToken,
          location: formData.location,
          category: formData.category,
          founded: formData.founded,
          size: formData.size,
          website: formData.website,
          linkedin: formData.linkedin,
          coordinates,
          planId
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        const selectedPlan = plans.find(plan => plan.id === planId);
        toast.success(`Redirecting to ${selectedPlan?.name} payment...`);
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Payment URL not received");
        setLoading(false);
      }

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);

      if (captchaRef && captchaRef.current) {
        captchaRef.current.reset();
        setCaptchaToken(null);
      }
    }
  };

  return (
    <div className="csf-form-container">
      <form className="csf-form">
        {/* Step 1: Account Info */}
        {step === 1 && (
          <>
            <h2 className="csf-step-title">Account Information</h2>
            <input
              type="text"
              name="username"
              placeholder="Company Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="csf-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="csf-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="csf-input"
            />
            <div className="csf-buttons">
              <button type="button" onClick={handleNext} className="csf-btn-primary">
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 2: Company Details */}
        {step === 2 && (
          <>
            <h2 className="csf-step-title">Company Details</h2>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="csf-input"
            >
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="number"
              name="founded"
              placeholder="Founded Year"
              value={formData.founded}
              onChange={handleChange}
              required
              className="csf-input"
            />
            <input
              type="text"
              name="size"
              placeholder="Company Size (e.g., 10-50 employees)"
              value={formData.size}
              onChange={handleChange}
              required
              className="csf-input"
            />
            <input
              type="url"
              name="website"
              placeholder="Website (optional)"
              value={formData.website}
              onChange={handleChange}
              className="csf-input"
            />
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn (optional)"
              value={formData.linkedin}
              onChange={handleChange}
              className="csf-input"
            />

            <div className="csf-buttons">
              <button type="button" onClick={handleBack} className="csf-btn-outline">
                ← Back
              </button>
              <button type="button" onClick={handleNext} className="csf-btn-primary">
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <>
            <h2 className="csf-step-title">Company Location</h2>

            {/* Barre de recherche */}
            <div className="csf-location-search">
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="csf-input"
              />
              <button type="button" className="csf-btn-search" onClick={handleSearch}>
                🔍 Search
              </button>
            </div>

            {/* Carte Leaflet */}
            <LocationPicker lat={parseFloat(formData.lat)} lng={parseFloat(formData.lng)} />


            <div className="csf-buttons">
              <button type="button" onClick={handleBack} className="csf-btn-outline">
                ← Back
              </button>
              <button type="button" onClick={handleNext} className="csf-btn-primary">
                Next →
              </button>
            </div>
          </>
        )}

        {/* Step 4: Summary & Captcha */}
        {step === 4 && (
          <>
            <h2 className="csf-step-title">Registration Summary</h2>

            <div className="csf-summary">
              <h4>📋 Please Review Your Information</h4>
              <div className="csf-summary-grid">
                <div className="csf-summary-item">
                  <strong>Company:</strong> {formData.username}
                </div>
                <div className="csf-summary-item">
                  <strong>Email:</strong> {formData.email}
                </div>
                <div className="csf-summary-item">
                  <strong>Category:</strong> {formData.category}
                </div>
                <div className="csf-summary-item">
                  <strong>Founded:</strong> {formData.founded}
                </div>
               
                
              </div>
            </div>

            {/* Affichage du captcha */}
            <div className="csf-captcha-section">
              {/* Le captcha doit être rendu ici par le composant parent */}
            </div>

            <div className="csf-buttons">
              <button type="button" onClick={handleBack} className="csf-btn-outline">
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!captchaToken}
                className="csf-btn-primary"
              >
                {!captchaToken ? (
                  <>🔒 Complete Captcha First</>
                ) : (
                  <>Next: Choose Plan →</>
                )}
              </button>
            </div>
          </>
        )}

        {/* Step 5: Plan Selection */}
       {/* Step 5: Plan Selection avec carrousel */}
{step === 5 && (
  <>
    <h2 className="csf-step-title">🎯 Choose Your Plan</h2>

    <div className="csf-plans-carousel">
      {/* Flèche gauche */}
     <button
  type="button"
  className="csf-carousel-arrow"
  onClick={() =>
    setCurrentPlanIndex((prev) => (prev === 0 ? plans.length - 1 : prev - 1))
  }
>
  ‹
</button>

      {/* Carte du plan actuel */}
{plans.length > 0 && (
  <div className="csf-plan-card">
    {plans[currentPlanIndex].id === 'pro' && (
      <div className="csf-popular-badge">
        🌟 Most Popular
        {/* Logo juste en dessous du badge */}
      </div>
    )}
    <div className="csf-plan-content">
       <img
        src={plans[currentPlanIndex].id === 'lite' ? assets.MatchandGolite : assets.MatchandGopreimum}
        alt={`${plans[currentPlanIndex].name} Plan`}
        className="csf-plan-image"
      />
      <div className="csf-plan-price">
        <span className="csf-price-amount">
          ${plans[currentPlanIndex].id === 'lite' ? '100' : '253'}
        </span>
        <span className="csf-price-period">/month</span>
      </div>
     
      <div className="csf-plan-features">
        {plans[currentPlanIndex].id === 'lite' ? (
          <>
            <div className="csf-feature">✅ 2 job postings/day</div>
            <div className="csf-feature">✅ Advanced candidate search</div>
            <div className="csf-feature">✅ Analytics & insights</div>
          </>
        ) : (
          <>
            <div className="csf-feature">✅ Unlimited job postings</div>
            <div className="csf-feature">✅ Advanced candidate search</div>
            <div className="csf-feature">✅ Analytics & insights</div>
          </>
        )}
      </div>
      <button
        className={`csf-plan-button ${
          plans[currentPlanIndex].id === 'pro' ? 'csf-pro-button' : 'csf-lite-button'
        }`}
        onClick={() => handlePayment(plans[currentPlanIndex].id)}
        disabled={loading || !captchaToken}
      >
        {loading
          ? "⏳ Processing..."
          : !captchaToken
          ? "🔒 Complete Captcha First"
          : `💳 Choose ${plans[currentPlanIndex].name}`}
      </button>
    </div>
  </div>
)}


      {/* Flèche droite */}
     <button
  type="button"
  className="csf-carousel-arrow"
  onClick={() =>
    setCurrentPlanIndex((prev) => (prev === plans.length - 1 ? 0 : prev + 1))
  }
>
  ›
</button>
    </div>

    <div className="csf-security-note">
      🔒 Secure payment processed by Stripe • Cancel anytime
    </div>

    <div className="csf-buttons">
      <button type="button" onClick={handleBack} className="csf-btn-outline">
        ← Back
      </button>
    </div>
  </>
)}


        {/* Progress indicator */}
        <div className="csf-progress">
          <div className="csf-progress-bar">
            <div
              className="csf-progress-fill"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
          <div className="csf-progress-text">
            Step {step} of 5
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanySignUpForm;