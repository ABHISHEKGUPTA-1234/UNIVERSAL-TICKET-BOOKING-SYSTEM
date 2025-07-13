import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api/users";

// SIGNUP
export const signupUser = async (username, email, password, accountType) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/signup`, {
      username,
      email,
      password,
      accountType
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Signup failed" };
  }
};

// LOGIN
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// UPDATE coins and bookings
export const updateUserData = async (userId, coins, bookings) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${userId}`, {
      coins,
      bookings
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Update failed" };
  }
};

// ✅ UPDATE user profile (username, email, password)
export const updateUserProfile = async (userId, username, email, password) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/update-profile/${userId}`, {
      username,
      email,
      password
    });

    // ✅ Return the `updatedUser` part of the response if present
    if (res.data.updatedUser) {
      return res.data.updatedUser;
    }

    // Fallback in case response is direct
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Profile update failed" };
  }
};

// RESET PASSWORD
export const resetPassword = async (email, newPassword) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/reset-password`, {
      email,
      newPassword
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Password reset failed" };
  }
};

// CHECK IF EMAIL EXISTS (for forgot password flow)
export const checkEmailExists = async (email) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/check-email`, { email });
    return res.data;
  } catch (error) {
    throw error.response?.data || { error: "Error checking email" };
  }
};
