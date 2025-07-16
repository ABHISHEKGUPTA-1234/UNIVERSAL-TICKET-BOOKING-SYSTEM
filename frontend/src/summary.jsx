import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUserData } from './api';
import './App.css';
function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const [coinError, setCoinError] = useState(false);
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("userCoins") || "0"));
  if (!booking) {
    return <p style={{ padding: '30px', textAlign: 'center' }}>No booking details available. Please return to the main page.</p>;
  }
  const handleConfirmClick = async () => {
    const price = booking.price || (booking.type === 'Train' ? 150 : booking.type === 'Movie' ? 250 : 500);
    if (coins < price) {
      setCoinError(true);
      return;
    }
    const newCoins = coins - price;
    setCoins(newCoins);
    setCoinError(false);
    localStorage.setItem("userCoins", newCoins.toString());
    const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
    const uniqueBooking = { ...booking, id: Date.now() + Math.random() };
    const updatedBookings = [...existing, uniqueBooking];
    localStorage.setItem("myBookings", JSON.stringify(updatedBookings));
    const userId = localStorage.getItem("userId");
    try {
      await updateUserData(userId, newCoins, updatedBookings);
    } 
    catch (err) {
      console.error("Failed to sync with backend:", err);
    }
    navigate('/bookings');
  };
  const handleCancel = () => {
    navigate('/home');
  };
  return (
    <div className="main-page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <h2 className="main-page-header" style={{ justifyContent: 'center', fontSize: '2em', marginBottom: '30px' }}>
        SUMMARY
      </h2>
      <div
        className="main-section"
        style={{
          fontSize: '1.2em',
          lineHeight: '2',
          textAlign: 'left',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <div>Event Type : {booking.type}</div>
        <div>Name : {booking.name}</div>
        <div>Date : {booking.date}</div>
        <div>Time : {booking.time}</div>
        {booking.type === 'Train' ? (
          <>
            <div>From: {booking.location}</div>
            <div>To: {booking.destination}</div>
          </>
        ) : (
          <div>Location: {booking.location}</div>
        )}
        <div>Price: ₹{booking.price || (booking.type === 'Train' ? 150 : booking.type === 'Movie' ? 250 : 500)}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
        {coinError && (
          <p style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
            NOT HAVE ENOUGH COINS
          </p>
        )}
        <div style={{ display: 'flex', gap: '25px' }}>
          <button
            className="sign-in-button"
            style={{ backgroundColor: 'green', width: '130px' }}
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
          <button
            className="sign-in-button"
            style={{ backgroundColor: 'red', width: '130px' }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
export default Summary;
