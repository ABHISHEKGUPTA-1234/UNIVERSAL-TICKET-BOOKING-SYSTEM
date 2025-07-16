import axios from 'axios';
const API_BASE_URL = "http://localhost:5000/api/users";
export const signupUser = async (username, email, password, accountType) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/signup`, {
      username,
      email,
      password,
      accountType
    });
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Signup failed" };
  }
};
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password
    });
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};
export const updateUserData = async (userId, coins, bookings) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${userId}`, {
      coins,
      bookings
    });
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Update failed" };
  }
};
export const updateUserProfile = async (userId, username, email, password) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/update-profile/${userId}`, {
      username,
      email,
      password
    });
    if (res.data.updatedUser) return res.data.updatedUser;
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Profile update failed" };
  }
};
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await axios.post(`${API_BASE_URL}/upload-profile-image/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Image upload failed" };
  }
};
export const removeProfileImage = async (userId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/remove-profile-image/${userId}`);
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Image removal failed" };
  }
};
export const resetPassword = async (email, newPassword) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/reset-password`, {
      email,
      newPassword
    });
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Password reset failed" };
  }
};
export const checkEmailExists = async (email) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/check-email`, { email });
    return res.data;
  } 
  catch (error) {
    throw error.response?.data || { error: "Error checking email" };
  }
};
