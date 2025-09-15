import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import './updatesettings.css';

// Fix icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UpdateSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({ cover: null, avatar: null });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    description: '',
    category: '',
    lat: '',
    lng: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:7001/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setUser(data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          phone: data.candidateInfo?.phoneNumber || '',
          location: data.candidateInfo?.location || data.companyInfo?.location || '',
          dateOfBirth: data.candidateInfo?.dateOfBirth
            ? new Date(data.candidateInfo.dateOfBirth).toISOString().substr(0, 10)
            : '',
          description: data.companyInfo?.description || '',
          category: data.companyInfo?.category || '',
          lat: data.companyInfo?.coordinates?.lat || '',
          lng: data.companyInfo?.coordinates?.lng || '',
        });
      } catch (err) {
        console.error(err);
        toast.error('Error loading profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (type, file) => setFiles(prev => ({ ...prev, [type]: file }));

  // Met à jour le marker sur la carte
  const handleMapClick = ({ lat, lng }) => {
    setFormData(prev => ({ ...prev, lat, lng }));
  };

  // Leaflet component
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
        style={{ height: '300px', width: '100%' }}
        key={`${lat}-${lng}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

  // Search location using Nominatim
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

  const updateFile = async (type, endpoint) => {
    if (!files[type]) return toast.warning(`Please select a ${type} file!`);
    const form = new FormData();
    form.append(type === 'cover' ? 'cover_User' : 'image_User', files[type]);

    try {
      const res = await fetch(`http://localhost:7001/api/users/${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: form,
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setUser(prev => ({
        ...prev,
        [type === 'cover' ? 'cover_User' : 'image_User']: data[type === 'cover' ? 'cover_User' : 'image_User']
      }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Error updating ${type}.`);
    }
  };

  const updateProfile = async () => {
    try {
      const payload = { username: formData.username, email: formData.email };

      if (user.role === 'candidate') {
        payload.candidateInfo = {
          phoneNumber: formData.phone,
          location: formData.location,
          dateOfBirth: formData.dateOfBirth,
        };
      } else if (user.role === 'company') {
        payload.companyInfo = {
          location: formData.location,
          description: formData.description,
          category: formData.category,
          coordinates: {
            lat: parseFloat(formData.lat) || 0,
            lng: parseFloat(formData.lng) || 0,
          },
        };
      }

      const res = await fetch('http://localhost:7001/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setUser(data);
      toast.success('Profile updated successfully!');
      navigate('/settings');
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="update-profile-card">
      <button className="back-button" onClick={() => navigate('/settings')}>
        ← Back to Settings
      </button>

      {['cover', 'avatar'].map(type => (
        <div key={type} className={`${type}-section`}>
          <img
            src={user[type === 'cover' ? 'cover_User' : 'image_User']
              ? `http://localhost:7001/images/${user[type === 'cover' ? 'cover_User' : 'image_User']}`
              : type === 'cover' ? '/defaultCover.png' : '/defaultAvatar.png'}
            alt={type}
          />
          <label className="file-label">
            Choose {type.charAt(0).toUpperCase() + type.slice(1)}
            <input type="file" onChange={e => handleFileChange(type, e.target.files[0])} />
          </label>
          {files[type] && <span className="file-name">{files[type].name}</span>}
          <button onClick={() => updateFile(type, type === 'cover' ? 'update-cover' : 'update-photo')}>
            Update {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      ))}

      <div className="form-section">
        <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />

        {user.role === 'candidate' && (
          <>
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
          </>
        )}

        {user.role === 'company' && (
          <>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
            <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />

            {/* Barre de recherche */}
            <div className="location-search">
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {/* Carte Leaflet interactive */}
            <LocationPicker lat={parseFloat(formData.lat)} lng={parseFloat(formData.lng)} />
            <p>Latitude: {formData.lat}</p>
            <p>Longitude: {formData.lng}</p>
          </>
        )}

        <button onClick={updateProfile}>Save Changes</button>
      </div>
    </div>
  );
};

export default UpdateSettings;
