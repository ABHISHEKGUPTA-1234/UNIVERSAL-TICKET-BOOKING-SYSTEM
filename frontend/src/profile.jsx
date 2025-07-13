import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { updateUserProfile } from './api';

function ProfilePage({ loggedInUser, handleLogout, loginPassword, setLoggedInUser}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(loggedInUser);
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail") || '');
  const [saveMessage, setSaveMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [password, setPassword] = useState(loginPassword || '********');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const latestUsername = localStorage.getItem("loggedInUser") || '';
    const latestEmail = localStorage.getItem("userEmail") || '';
    setUsername(latestUsername);
    setEmail(latestEmail);
    setPassword('********'); // reset display password field
    console.log("Loaded profile data for:", latestUsername, latestEmail);
  }, [location.pathname]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      const updated = await updateUserProfile(userId, username, email, password);
      setSaveMessage("Profile updated successfully!");

      // Sync changes to localStorage and state
      localStorage.setItem("loggedInUser", updated.username);
      localStorage.setItem("userEmail", updated.email);
      setLoggedInUser(updated.username);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(err.error || "Update failed");
    }
  };


  return (
    <div className="main-page-wrapper">
      <header className="main-page-header" style={{ justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center', width: '100%' }}>PROFILE</h1>
      </header>

      <section className="main-section profile-section">
        <h3>PERSONAL INFORMATION</h3>
        <form onSubmit={handleSave} className="profile-form">

          {/* Profile Photo */}
          <div className="form-group">
            <label>Profile Photo:</label>
            <div className="profile-photo-wrapper">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-photo-circle" />
              ) : (
                <div className="profile-photo-initial">
                  {username ? username.charAt(0).toUpperCase() : "?"}
                </div>
              )}
              <label htmlFor="profileImageUpload" className="edit-photo-button">
                Edit
                <input
                  type="file"
                  id="profileImageUpload"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  hidden
                />
              </label>
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && <p className="success-message">{saveMessage}</p>}

          {/* Action Buttons */}
          <div className="profile-actions" style={{ flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            <button
              type="submit"
              className="main-action-button save-button"
              style={{ width: '120px', padding: '6px 0', fontSize: '0.85em' }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="main-option-button logout-button"
              style={{ width: '120px', padding: '6px 0', fontSize: '0.85em' }}
            >
              Logout
            </button>
          </div>
        </form>
      </section>

      {/* Bottom Navigation Buttons */}
      <section className="main-section manage-section">
        <div className="manage-options">
          <button
            className="main-option-button"
            onClick={() => navigate('/home')}
          >
            🏠 Home
          </button>
          <button
            className="main-option-button"
            onClick={() => navigate('/bookings')}
          >
            🗓️ View My Bookings
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
