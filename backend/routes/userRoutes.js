const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => { 
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); 
  }
});
const upload = multer({ storage });
router.post('/signup', async (req, res) => {
  const { username, email, password, accountType } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ error: "Username or email already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    let coins = 2000;
    if (accountType === 'vendor') coins = 3000;
    else if (accountType === 'admin') coins = 4000;
    const newUser = new User({
      username,
      email,
      passwordHash,
      coins,
      accountType
    });
    await newUser.save();
    res.status(201).json({ message: "User created!" });
  } 
  catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      coins: user.coins,
      bookings: user.bookings,
      accountType: user.accountType,
      profileImage: user.profileImage || ""
    });
  } 
  catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});
router.put('/:id', async (req, res) => {
  const { coins, bookings } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { coins, bookings },
      { new: true }
    );
    res.json(updatedUser);
  } 
  catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});
router.put('/update-profile/:id', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const updates = { username, email };
    if (password && password !== '********') {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.passwordHash = passwordHash;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.json({
      message: "Profile updated",
      updatedUser: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } 
  catch (err) {
    res.status(500).json({ error: "Profile update failed" });
  }
});
router.post('/upload-profile-image/:id', upload.single('image'), async (req, res) => {
  const userId = req.params.id;
  try {
    const imagePath = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true }
    );
    res.json({ message: "Profile image updated", imagePath });
  } 
  catch (err) {
    res.status(500).json({ error: "Failed to upload profile image" });
  }
});
router.delete('/remove-profile-image/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const previousImage = user.profileImage;
    if (previousImage && previousImage.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', previousImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    user.profileImage = "";
    await user.save();
    res.json({ message: "Profile image removed" });
  } 
  catch (err) {
    res.status(500).json({ error: "Failed to remove profile image" });
  }
});
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Account not found" });
    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } 
  catch (err) {
    res.status(500).json({ error: "Password reset failed" });
  }
});
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "ACCOUNT DOES NOT EXIST" });
    res.json({ exists: true });
  } 
  catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
