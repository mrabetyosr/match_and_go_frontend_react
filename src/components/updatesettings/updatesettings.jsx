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
  const [usr, setUsr] = useState(null);
  const [ld, setLd] = useState(true);
  const [fls, setFls] = useState({ cv: null, av: null });
  const [fData, setFData] = useState({
    uname: '',
    em: '',
    ph: '',
    loc: '',
    dob: '',
    desc: '',
    cat: '',
    lat: '',
    lng: '',
  });
  const [sQry, setSQry] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const fUsr = async () => {
      try {
        const res = await fetch('http://localhost:7001/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setUsr(data);
        setFData({
          uname: data.username || '',
          em: data.email || '',
          ph: data.candidateInfo?.phoneNumber || '',
          loc: data.candidateInfo?.location || data.companyInfo?.location || '',
          dob: data.candidateInfo?.dateOfBirth
            ? new Date(data.candidateInfo.dateOfBirth).toISOString().substr(0, 10)
            : '',
          desc: data.companyInfo?.description || '',
          cat: data.companyInfo?.category || '',
          lat: data.companyInfo?.coordinates?.lat || '',
          lng: data.companyInfo?.coordinates?.lng || '',
        });
      } catch (err) {
        console.error(err);
        toast.error('Error loading profile.');
      } finally {
        setLd(false);
      }
    };
    fUsr();
  }, []);

  const hChange = e => setFData({ ...fData, [e.target.name]: e.target.value });
  const hFileChange = (t, f) => setFls(prev => ({ ...prev, [t]: f }));

  const hMapClick = ({ lat, lng }) => setFData(prev => ({ ...prev, lat, lng }));

  const LocPicker = ({ lat, lng }) => {
    const MapEvt = () => {
      useMapEvents({
        click(e) {
          hMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
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
        className="mp-cntr-xyz"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {lat && lng && (
          <Marker
            position={[lat, lng]}
            draggable={true}
            eventHandlers={{
              dragend: e => hMapClick({ lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng }),
            }}
          />
        )}
        <MapEvt />
      </MapContainer>
    );
  };

  const hSearch = async () => {
    if (!sQry) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(sQry)}`
      );
      const results = await res.json();
      if (results.length === 0) return toast.warning('Location not found');

      const { lat, lon, display_name } = results[0];
      setFData(prev => ({ ...prev, lat: parseFloat(lat), lng: parseFloat(lon), loc: display_name }));
      toast.success('Location updated on map!');
    } catch (err) {
      console.error(err);
      toast.error('Error searching location.');
    }
  };

  const updFile = async (t, ep) => {
    if (!fls[t]) return toast.warning(`Please select a ${t} file!`);
    const f = new FormData();
    f.append(t === 'cv' ? 'cover_User' : 'image_User', fls[t]);
    try {
      const res = await fetch(`http://localhost:7001/api/users/${ep}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: f,
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setUsr(prev => ({ ...prev, [t === 'cv' ? 'cover_User' : 'image_User']: data[t === 'cv' ? 'cover_User' : 'image_User'] }));
      toast.success(`${t} updated successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Error updating ${t}.`);
    }
  };

  const updProfile = async () => {
    try {
      const payload = { username: fData.uname, email: fData.em };
      if (usr.role === 'candidate') {
        payload.candidateInfo = { phoneNumber: fData.ph, location: fData.loc, dateOfBirth: fData.dob };
      } else if (usr.role === 'company') {
        payload.companyInfo = {
          location: fData.loc,
          description: fData.desc,
          category: fData.cat,
          coordinates: { lat: parseFloat(fData.lat) || 0, lng: parseFloat(fData.lng) || 0 },
        };
      }

      const res = await fetch('http://localhost:7001/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setUsr(data);
      toast.success('Profile updated successfully!');
      nav('/settings');
    } catch (err) {
      console.error(err);
      toast.error('Error updating profile.');
    }
  };

  if (ld) return <p className="ld-msg-xyz">Loading...</p>;
  if (!usr) return <p className="usr-notfound-xyz">User not found</p>;

  return (
    <div className="upd-cntr-xyz">
      <button className="bck-btn-xyz" onClick={() => nav('/settings')}>← Back</button>

      {['cv', 'av'].map(t => (
        <div key={t} className={`sec-${t}-xyz`}>
          <img
            src={usr[t === 'cv' ? 'cover_User' : 'image_User']
              ? `http://localhost:7001/images/${usr[t === 'cv' ? 'cover_User' : 'image_User']}`
              : t === 'cv' ? '/defaultCover.png' : '/defaultAvatar.png'}
            alt={t}
            className={`img-${t}-xyz`}
          />
          <label className={`lbl-${t}-xyz`}>
            Choose {t.toUpperCase()}
            <input type="file" onChange={e => hFileChange(t, e.target.files[0])} />
          </label>
          {fls[t] && <span className={`fn-${t}-xyz`}>{fls[t].name}</span>}
          <button className={`btn-${t}-xyz`} onClick={() => updFile(t, t === 'cv' ? 'update-cover' : 'update-photo')}>
            Update {t.toUpperCase()}
          </button>
        </div>
      ))}

      <div className="frm-sec-xyz">
        <input name="uname" value={fData.uname} onChange={hChange} placeholder="Username" />
        <input name="em" value={fData.em} onChange={hChange} placeholder="Email" />

        {usr.role === 'candidate' && (
          <>
            <input name="ph" value={fData.ph} onChange={hChange} placeholder="Phone" />
            <input name="loc" value={fData.loc} onChange={hChange} placeholder="Location" />
            <input type="date" name="dob" value={fData.dob} onChange={hChange} />
          </>
        )}

        {usr.role === 'company' && (
          <>
            <input name="loc" value={fData.loc} onChange={hChange} placeholder="Location" />
            <input name="desc" value={fData.desc} onChange={hChange} placeholder="Description" />
            <input name="cat" value={fData.cat} onChange={hChange} placeholder="Category" />

            <div className="loc-srch-xyz">
              <input type="text" value={sQry} onChange={e => setSQry(e.target.value)} placeholder="Search location..." />
              <button onClick={hSearch}>Search</button>
            </div>

            <LocPicker lat={parseFloat(fData.lat)} lng={parseFloat(fData.lng)} />
            <p className="lat-lng-xyz">Latitude: {fData.lat}</p>
            <p className="lat-lng-xyz">Longitude: {fData.lng}</p>
          </>
        )}

        <button className="btn-save-xyz" onClick={updProfile}>Save Changes</button>
      </div>
    </div>
  );
};

export default UpdateSettings;
