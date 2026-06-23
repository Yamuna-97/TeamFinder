import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactEmail: '',
    phoneNumber: '',
    registerNumber: '',
    department: '',
    year: '',
    section: '',
    bio: '',
    githubLink: '',
    linkedinLink: '',
    portfolioLink: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
    'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.registerNumber) newErrors.registerNumber = 'Register number is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.year) {
      newErrors.year = 'Year is required'
    } else if (formData.year < 1 || formData.year > 5) {
      newErrors.year = 'Year must be between 1 and 5'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      await register({
        ...formData,
        year: parseInt(formData.year)
      })
      navigate('/dashboard')
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {errors.general}
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className={`mt-1 input-field ${errors.name ? 'border-red-500' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  className={`mt-1 input-field ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  name="password"
                  className={`mt-1 input-field ${errors.password ? 'border-red-500' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`mt-1 input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">College Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Register Number *</label>
                <input
                  type="text"
                  name="registerNumber"
                  className={`mt-1 input-field ${errors.registerNumber ? 'border-red-500' : ''}`}
                  value={formData.registerNumber}
                  onChange={handleChange}
                />
                {errors.registerNumber && <p className="mt-1 text-sm text-red-600">{errors.registerNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department *</label>
                <select
                  name="department"
                  className={`mt-1 input-field ${errors.department ? 'border-red-500' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year *</label>
                <input
                  type="number"
                  name="year"
                  min="1"
                  max="5"
                  className={`mt-1 input-field ${errors.year ? 'border-red-500' : ''}`}
                  value={formData.year}
                  onChange={handleChange}
                />
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="section"
                  className="mt-1 input-field"
                  value={formData.section}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Additional Information (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="mt-1 input-field"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="mt-1 input-field"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="mt-1 input-field"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
                <input
                  type="url"
                  name="githubLink"
                  className="mt-1 input-field"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedinLink"
                  className="mt-1 input-field"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio Website</label>
                <input
                  type="url"
                  name="portfolioLink"
                  className="mt-1 input-field"
                  value={formData.portfolioLink}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register