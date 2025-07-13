import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserData } from './api'; // ✅ import the backend sync
import "./App.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("none");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myBookings") || "[]");
    const initialized = saved.map(b => ({ ...b, isCancelled: b.isCancelled || false }));
    setBookings(initialized);
  }, []);

  const handleCancelClick = (id) => {
    setSelectedBookingId(id);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    let newCoins = parseInt(localStorage.getItem("userCoins") || "0");
    const updated = bookings.map(b => {
      if (b.id === selectedBookingId && !b.isCancelled) {
        const price = b.price || (b.type === 'Train' ? 150 : b.type === 'Movie' ? 250 : 500);
        newCoins += price;
        return { ...b, isCancelled: true };
      }
      return b;
    });

    setBookings(updated);
    localStorage.setItem("myBookings", JSON.stringify(updated));
    localStorage.setItem("userCoins", newCoins.toString());

    // ✅ Sync with backend
    const userId = localStorage.getItem("userId");
    try {
      await updateUserData(userId, newCoins, updated);
    } catch (err) {
      console.error("Failed to sync with backend:", err);
    }

    setShowConfirm(false);
    setSelectedBookingId(null);
  };

  const cancelDialog = () => {
    setShowConfirm(false);
    setSelectedBookingId(null);
  };

  const timeToNumber = (time) => {
    if (time === "Morning") return 0;
    if (time === "Afternoon") return 1;
    if (time === "Evening") return 2;
    return 3;
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return timeToNumber(a.time) - timeToNumber(b.time);
  });

  const filteredBookings = sortedBookings.filter(b => {
    if (filter === "cancelled") return b.isCancelled;
    if (filter === "not_cancelled") return !b.isCancelled;
    return true;
  });

  return (
    <div className="main-page-wrapper" style={{ position: 'relative' }}>
      <h2 className="main-page-header" style={{ justifyContent: 'center', textAlign: 'center' }}>YOUR BOOKINGS</h2>

      <div className="filter-group" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filter === "none" && <option value="none" hidden>None</option>}
          <option value="not_cancelled">Not Cancelled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={() => setFilter("none")} className="clear-filters-button">Clear Filters</button>
      </div>

      {filteredBookings.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No bookings to show.</p>
      ) : (
        <div className="upcoming-list">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="upcoming-item">
              <span className="upcoming-type">{booking.type}</span>
              <span className="upcoming-name">{booking.name}</span>
              <span className="upcoming-details">
                {booking.date} at {booking.time} ({booking.location}{booking.destination ? ` to ${booking.destination}` : ''})
              </span>
              {booking.isCancelled ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>Cancelled</span>
              ) : (
                <button className="view-button" style={{ backgroundColor: 'red' }} onClick={() => handleCancelClick(booking.id)}>
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '20px' }}>ARE YOU SURE ???</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button className="view-button" style={{ backgroundColor: 'green', width: '100px' }} onClick={confirmCancel}>Yes</button>
              <button className="view-button" style={{ backgroundColor: 'red', width: '100px' }} onClick={cancelDialog}>No</button>
            </div>
          </div>
        </div>
      )}

      <section className="main-section manage-section">
        <div className="manage-options">
          <button className="main-option-button" onClick={() => navigate('/home')}>
            🏠 Home
          </button>
          <button className="main-option-button" onClick={() => navigate('/profile')}>
            👤 View Profile
          </button>
        </div>
      </section>
    </div>
  );
}

export default Bookings;
