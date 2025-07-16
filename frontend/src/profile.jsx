import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { updateUserProfile, uploadProfileImage, removeProfileImage } from './api';
function ProfilePage({ loggedInUser, handleLogout, loginPassword, setLoggedInUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(loggedInUser);
  const [usernameInput, setUsernameInput] = useState(loggedInUser);
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || '');
  const [saveMessage, setSaveMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [password, setPassword] = useState(localStorage.getItem("userPlainPassword") || '');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    const latestUsername = localStorage.getItem("loggedInUser") || '';
    const latestEmail = localStorage.getItem("userEmail") || '';
    const storedPassword = localStorage.getItem("userPlainPassword") || '';
    const storedImage = localStorage.getItem("profileImage");
    setUsername(latestUsername);
    setUsernameInput(latestUsername);
    setEmail(latestEmail);
    setPassword(storedPassword);
    setPasswordChanged(false);
    setProfileImage(storedImage || null);
    setNewProfileImageFile(null);
    setImageRemoved(false);
  }, [location.pathname]);
  const handleSave = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    try {
      const updated = await updateUserProfile(
        userId,
        usernameInput,
        email,
        passwordChanged ? password : ''
      );
      localStorage.setItem("loggedInUser", updated.username);
      localStorage.setItem("userEmail", updated.email);
      if (passwordChanged && password.trim() !== '') localStorage.setItem("userPlainPassword", password);
      setLoggedInUser(updated.username);
      setUsername(usernameInput);
      if (imageRemoved) {
        await removeProfileImage(userId);
        setProfileImage(null);
        localStorage.removeItem("profileImage");
      } 
      else if (newProfileImageFile) {
        const res = await uploadProfileImage(userId, newProfileImageFile);
        const fullPath = `http://localhost:5000${res.imagePath}`;
        setProfileImage(fullPath);
        localStorage.setItem("profileImage", fullPath);
      }
      setNewProfileImageFile(null);
      setImageRemoved(false);
      setSaveMessage("Profile updated successfully!");
      setPasswordChanged(false);
      setTimeout(() => setSaveMessage(''), 3000);
    } 
    catch (err) {
      setSaveMessage(err.error || "Update failed");
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImageFile(file);
      setImageRemoved(false);
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
          <div className="form-group">
            <label>Profile Photo:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="profile-photo-wrapper">
                {newProfileImageFile ? (
                  <img src={URL.createObjectURL(newProfileImageFile)} alt="New Profile" className="profile-photo-circle" />
                ) : profileImage && !imageRemoved ? (
                  <img src={profileImage} alt="Profile" className="profile-photo-circle" />
                ) : (
                  <div className="profile-photo-initial">
                    {username ? username.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  htmlFor="fileUpload"
                  style={{
                    cursor: 'pointer',
                    color: '#007bff',
                    textDecoration: 'underline',
                    fontSize: '0.9em'
                  }}
                >
                  Edit
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewProfileImageFile(null);
                    setImageRemoved(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    fontSize: '0.85em',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <input
              type="file"
              id="fileUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                placeholder="Password used during login"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordChanged(true);
                }}
                style={{ width: '100%' }}
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {saveMessage && <p className="success-message">{saveMessage}</p>}
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
      <section className="main-section manage-section">
        <div className="manage-options">
          <button className="main-option-button" onClick={() => navigate('/home')}>
            Home
          </button>
          <button className="main-option-button" onClick={() => navigate('/bookings')}>
            View My Bookings
          </button>
        </div>
      </section>
    </div>
  );
}
export default ProfilePage;
