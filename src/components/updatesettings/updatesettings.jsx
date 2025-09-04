import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './updatesettings.css';

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
  });

  const navigate = useNavigate();

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
      {/* Bouton Retour */}
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
          </>
        )}

        <button onClick={updateProfile}>Save Changes</button>
      </div>
    </div>
  );
};

export default UpdateSettings;
