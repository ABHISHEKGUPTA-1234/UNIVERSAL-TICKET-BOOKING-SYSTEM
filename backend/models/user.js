const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  destination: { type: String },
  isCancelled: { type: Boolean, default: false }
}, { _id: false });
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  coins:    { type: Number, default: 2000 },
  bookings: { type: [bookingSchema], default: [] },
  accountType: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user'
  },
  profileImage: { type: String, default: "" }
});
module.exports = mongoose.model('User', userSchema);
