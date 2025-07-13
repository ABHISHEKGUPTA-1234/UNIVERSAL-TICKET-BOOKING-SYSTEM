const mongoose = require('mongoose');

// Sub-schema for bookings
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  destination: { type: String }, // Optional, only for Train
  isCancelled: { type: Boolean, default: false }
}, { _id: false }); // No separate _id for subdocuments

// Main User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  coins:    { type: Number, default: 2000 },
  bookings: { type: [bookingSchema], default: [] },
  accountType: {                     // ✅ Add account type field
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
