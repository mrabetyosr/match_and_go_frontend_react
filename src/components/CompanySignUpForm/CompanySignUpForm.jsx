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
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

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
        center={[lat || 36.81897, lng || 10.16579]} // par défaut Tunis
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

  const handleSubmit = async (e) => {
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

      toast.success(res.data.message || "✅ Registration successful!");
      setFormData({
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
      if (captchaRef?.current) captchaRef.current.reset();
      setCaptchaToken("");
      onClose({ success: true, role: "company" });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="csf-form" onSubmit={handleSubmit}>
      {/* Step 1 */}
      {step === 1 && (
        <>
          <input type="text" name="username" placeholder="Company Name" value={formData.username} onChange={handleChange} required className="csf-input" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="csf-input" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="csf-input" />
          <div className="csf-buttons">
            <button type="button" onClick={handleNext} className="csf-btn-primary">Next</button>
          </div>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <select name="category" value={formData.category} onChange={handleChange} required className="csf-input">
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input type="number" name="founded" placeholder="Founded Year" value={formData.founded} onChange={handleChange} required className="csf-input" />
          <input type="text" name="website" placeholder="Website" value={formData.website} onChange={handleChange} className="csf-input" />
          <input type="text" name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} className="csf-input" />
          <input type="text" name="size" placeholder="Company Size" value={formData.size} onChange={handleChange} required className="csf-input" />

          <div className="csf-buttons">
            <button type="button" onClick={handleBack} className="csf-btn-outline">Back</button>
            <button type="button" onClick={handleNext} className="csf-btn-primary">Next</button>
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>

          {/* Barre de recherche */}
          <div className="csf-location-search">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="csf-input"
            />
            <button type="button" className="csf-btn-primary" onClick={handleSearch}>Search</button>
          </div>

          {/* Carte Leaflet */}
          <LocationPicker lat={parseFloat(formData.lat)} lng={parseFloat(formData.lng)} />

          <div className="csf-buttons">
            <button type="button" onClick={handleBack} className="csf-btn-outline">Back</button>
            <button type="submit" disabled={loading} className="csf-btn-primary">{loading ? "Registering..." : "Sign Up"}</button>
          </div>
        </>
      )}
    </form>

  );
};

export default CompanySignUpForm;
