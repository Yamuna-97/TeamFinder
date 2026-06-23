import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
          const { data } = await axios.get('/api/auth/profile', config)
          setUser(data.data)
        } catch (err) {
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setLoading(false)
    }
    checkLoggedIn()
  }, [])

  // Register user
  const register = async (userData) => {
    try {
      setError(null)
      const { data } = await axios.post('/api/auth/register', userData)
      localStorage.setItem('token', data.data.token)
      setUser(data.data)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      throw err
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      setError(null)
      const { data } = await axios.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.data.token)
      setUser(data.data)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.put('/api/auth/profile', profileData, config)
      setUser(data.data)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed')
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext