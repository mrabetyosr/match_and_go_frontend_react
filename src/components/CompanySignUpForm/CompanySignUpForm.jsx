import React, { useState } from 'react';
import './CompanySignUpForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const categories = [
    "Tech",
    "Advertising&Marketing",
    "Culture&Media",
    "Consulting&Audit",
    "Education&Training",
    "Finance&Banking"
  ];

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
    
    // Si on arrive à l'étape 4 (après la carte), on montre les infos de paiement
    if (step === 3) {
      setShowPaymentInfo(true);
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 4) {
      setShowPaymentInfo(false);
    }
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

  // 💳 Gestion du paiement Stripe
  const handleStripePayment = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA first!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:7001/api/auth/register", {
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
        coordinates: formData.lat && formData.lng ? {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        } : undefined
      });

      // ✅ Backend retourne { message, checkoutUrl }
      if (res.data.checkoutUrl) {
        toast.success("Redirecting to payment...");
        
        // 🚀 Redirection vers Stripe Checkout
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.error("Payment URL not received");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  // Composant d'information sur le pricing
  const PricingInfo = () => (
    <div className="csf-pricing-info">
      <div className="csf-pricing-card">
        <h3>🚀 Company Premium Plan</h3>
        <div className="csf-price">
          <span className="csf-amount">$</span>
          <span className="csf-period">/month</span>
        </div>
        <ul className="csf-features">
          <li>✅ Unlimited job postings</li>
          <li>✅ Advanced candidate search</li>
          <li>✅ Company profile visibility</li>
          <li>✅ Analytics & insights</li>
          <li>✅ Priority support</li>
        </ul>
        <p className="csf-note">
          💡 Secure payment processed by Stripe
        </p>
      </div>
    </div>
  );

  return (
    <form className="csf-form" onSubmit={handleStripePayment}>
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
          
          {formData.location && (
            <div className="csf-selected-location">
              📍 <strong>Selected:</strong> {formData.location}
            </div>
          )}

          <div className="csf-buttons">
            <button type="button" onClick={handleBack} className="csf-btn-outline">
              ← Back
            </button>
            <button type="button" onClick={handleNext} className="csf-btn-primary">
              Continue to Payment →
            </button>
          </div>
        </>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <>
          <h2 className="csf-step-title">Complete Your Subscription</h2>
          
          <PricingInfo />
          
          <div className="csf-summary">
            <h4>📋 Registration Summary</h4>
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
              <strong>Location:</strong> {formData.location || "Not specified"}
            </div>
          </div>

          <div className="csf-buttons">
            <button type="button" onClick={handleBack} className="csf-btn-outline">
              ← Back
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="csf-btn-stripe"
            >
              {loading ? (
                <>⏳ Processing...</>
              ) : (
                <>💳 Pay with Stripe</>
              )}
            </button>
          </div>
        </>
      )}

      {/* Progress indicator */}
      <div className="csf-progress">
        <div className="csf-progress-bar">
          <div 
            className="csf-progress-fill" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        <div className="csf-progress-text">
          Step {step} of 4
        </div>
      </div>
    </form>
  );
};

export default CompanySignUpForm;