import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './settingsprofile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:7001/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error('Error loading profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-card">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

      {/* Cover */}
      <div className="cover">
        <img
          src={user.cover_User ? `http://localhost:7001/images/${user.cover_User}` : '/defaultCover.png'}
          alt="Cover"
        />
      </div>

      {/* Avatar */}
      <div className="avatar-section">
        <img
          src={user.image_User ? `http://localhost:7001/images/${user.image_User}` : '/defaultAvatar.png'}
          alt="Avatar"
          className="avatar"
        />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <p>{user.role}</p>
      </div>

      {/* Candidate-specific info */}
      {user.role === 'candidate' && (
        <div className="info-section">
          <p>Phone: {user.candidateInfo?.phoneNumber || '-'}</p>
          <p>Location: {user.candidateInfo?.location || '-'}</p>
          <p>Date of Birth: {user.candidateInfo?.dateOfBirth ? new Date(user.candidateInfo.dateOfBirth).toLocaleDateString() : '-'}</p>
        </div>
      )}

      {/* Company-specific info */}
      {user.role === 'company' && (
        <div className="info-section">
          <p>Description: {user.companyInfo?.description || '-'}</p>
          <p>Location: {user.companyInfo?.location || '-'}</p>
          <p>Category: {user.companyInfo?.category || '-'}</p>
        </div>
      )}

      {/* Update button */}
      <div className="update-section">
        <button onClick={() => navigate('/update-profile')}>Update Profile</button>
      </div>
    </div>
  );
};

export default SettingsProfile;
