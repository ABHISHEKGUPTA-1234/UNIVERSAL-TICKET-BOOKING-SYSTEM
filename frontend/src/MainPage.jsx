import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
function MainPage({ loggedInUser, handleLogout }) {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [coins, setCoins] = useState(() => {
    const stored = localStorage.getItem("userCoins");
    return stored ? parseInt(stored) : 0;
  });
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const types = ['Movie', 'Concert', 'Train'];
  const times = ['Morning', 'Afternoon', 'Evening'];
  const locations = ['Delhi', 'Mumbai', 'Chennai', 'Bengaluru'];
  const getDestinationOptions = () => {
    if (!selectedLocation) return locations;
    return locations.filter(loc => loc !== selectedLocation);
  };
  const handleProfileRedirect = () => navigate('/profile');
  const today = new Date();
  const formatDate = (date) => date.toISOString().split('T')[0];
  const date0 = formatDate(today);
  const date1 = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const date2 = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2));
  const date3 = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3));
  const allBookings = useMemo(() => ([
    { id: 1, type: 'Train', name: 'Delhi to Mumbai Express', date: date0, time: 'Afternoon', location: 'Delhi', destination: 'Mumbai' },
    { id: 2, type: 'Concert', name: 'Coldplay Live', date: date0, time: 'Morning', location: 'Delhi', destination: '' },
    { id: 3, type: 'Movie', name: 'Lord of the Rings', date: date0, time: 'Evening', location: 'Mumbai', destination: '' },
    { id: 4, type: 'Train', name: 'Chennai to Bengaluru Express', date: date1, time: 'Evening', location: 'Chennai', destination: 'Bengaluru' },
    { id: 5, type: 'Concert', name: 'BTS', date: date1, time: 'Afternoon', location: 'Mumbai', destination: '' },
    { id: 6, type: 'Movie', name: 'Avengers: Endgame', date: date1, time: 'Morning', location: 'Delhi', destination: '' },
    { id: 7, type: 'Train', name: 'Mumbai to Chennai Express', date: date2, time: 'Morning', location: 'Mumbai', destination: 'Chennai' },
    { id: 8, type: 'Concert', name: 'Alan Walker', date: date2, time: 'Evening', location: 'Chennai', destination: '' },
    { id: 9, type: 'Movie', name: 'Interstellar', date: date2, time: 'Afternoon', location: 'Bengaluru', destination: '' },
    { id: 10, type: 'Train', name: 'Delhi to Bengaluru Express', date: date3, time: 'Afternoon', location: 'Delhi', destination: 'Bengaluru' },
    { id: 11, type: 'Concert', name: 'Marshmello', date: date3, time: 'Morning', location: 'Delhi', destination: '' },
    { id: 12, type: 'Movie', name: 'The Hobbit', date: date3, time: 'Evening', location: 'Mumbai', destination: '' },
  ]), [date0, date1, date2, date3]);
  const filteredBookings = allBookings.filter(booking => {
    let match = true;
    if (selectedType && booking.type !== selectedType) match = false;
    if (selectedDate && booking.date !== selectedDate) match = false;
    if (selectedTime && booking.time !== selectedTime) match = false;
    if (selectedLocation && booking.location !== selectedLocation) match = false;
    if (selectedType === 'Train' && selectedDestination && booking.destination && booking.destination !== selectedDestination) match = false;
    return match;
  });
  return (
    <div className="main-page-wrapper">
      <header className="main-page-header">
        <h1>Universal Ticket Booking System</h1>
        <div className="user-profile-wrapper" style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: 'row' }}>
          <div className="coin-display" title="Your Coins">
            🪙 <span>{coins}</span>
          </div>
          <div
            className="user-profile-circle"
            onClick={() => setShowUserDropdown(prev => !prev)}
            title="Open Menu"
            style={{ overflow: 'hidden', padding: 0 }}
          >
            {localStorage.getItem("profileImage") ? (
              <img
                src={localStorage.getItem("profileImage")}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <span style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
                {loggedInUser && loggedInUser.length > 0 ? loggedInUser.charAt(0).toUpperCase() : "?"}
              </span>
            )}
          </div>
          {showUserDropdown && (
            <div className="user-dropdown">
              <button className="dropdown-signout-button" onClick={() => { setShowUserDropdown(false); navigate('/profile'); }}>Profile</button>
              <button className="dropdown-signout-button" onClick={() => handleLogout()}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <section className="main-section filter-section">
        <button className="toggle-filters-button" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {showFilters && (
          <div className="filter-options-container">
            <div className="filter-group">
              <label htmlFor="type-filter">Type:</label>
              <select id="type-filter" value={selectedType} onChange={(e) => { setSelectedType(e.target.value); if (e.target.value !== 'Train') setSelectedDestination(''); }}>
                <option value="">All Types</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="date-filter">Date:</label>
              <input type="date" id="date-filter" value={selectedDate} min={formatDate(today)} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div className="filter-group">
              <label htmlFor="time-filter">Time:</label>
              <select id="time-filter" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                <option value="">All Times</option>
                {times.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="location-filter">Location:</label>
              <select id="location-filter" value={selectedLocation} onChange={(e) => { setSelectedLocation(e.target.value); setSelectedDestination(''); }}>
                <option value="">All Locations</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            {selectedType === 'Train' && (
              <div className="filter-group">
                <label htmlFor="destination-filter">Destination:</label>
                <select id="destination-filter" value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
                  <option value="">All Destinations</option>
                  {getDestinationOptions().map(dest => <option key={dest} value={dest}>{dest}</option>)}
                </select>
              </div>
            )}
            <div className="filter-group">
              <label style={{ visibility: 'hidden' }}>Placeholder</label>
              <button className="clear-filters-button" onClick={() => {
                setSelectedType('');
                setSelectedDate('');
                setSelectedTime('');
                setSelectedLocation('');
                setSelectedDestination('');
              }}>
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </section>
      {filteredBookings.length > 0 ? (
        <section className="main-section upcoming-section">
          <h3>Upcoming/Filtered Bookings</h3>
          <div className="upcoming-list">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="upcoming-item">
                <span className="upcoming-type">{booking.type}</span>
                <span className="upcoming-name">{booking.name}</span>
                <span className="upcoming-details">
                  {booking.date} at {booking.time} ({booking.location}{booking.destination ? ` to ${booking.destination}` : ''})
                </span>
                <button className="view-button" onClick={() => navigate('/summary', { state: { booking } })}>View</button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        showFilters && (
          <section className="main-section upcoming-section">
            <p>No bookings found matching your selected filters.</p>
          </section>
        )
      )}
      <section className="main-section manage-section">
        <div className="manage-options">
          <button className="main-option-button" onClick={() => navigate('/bookings')}>
            View My Bookings
          </button>
          <button className="main-option-button" onClick={handleProfileRedirect}>Manage Profile</button>
        </div>
      </section>
    </div>
  );
}
export default MainPage;
