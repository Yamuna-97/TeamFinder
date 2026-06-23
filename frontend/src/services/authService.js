import axios from 'axios'

const API_URL = '/api/auth'

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  if (response.data) {
    localStorage.setItem('token', response.data.data.token)
  }
  return response.data
}

// Login user
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  if (response.data) {
    localStorage.setItem('token', response.data.data.token)
  }
  return response.data
}

// Get profile
const getProfile = async () => {
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(`${API_URL}/profile`, config)
  return response.data
}

// Update profile
const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(`${API_URL}/profile`, profileData, config)
  return response.data
}

// Logout
const logout = () => {
  localStorage.removeItem('token')
}

const authService = {
  register,
  login,
  getProfile,
  updateProfile,
  logout
}

export default authService