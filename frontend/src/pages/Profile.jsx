import React, { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import studentService from '../services/studentService'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState({ skillName: '', skillLevel: 'Beginner' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    contactEmail: user?.contactEmail || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.bio || '',
    githubLink: user?.githubLink || '',
    linkedinLink: user?.linkedinLink || '',
    portfolioLink: user?.portfolioLink || ''
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const { data } = await studentService.getMySkills()
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    }
  }

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await updateProfile(profileData)
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!newSkill.skillName.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data } = await studentService.addSkill(newSkill)
      setSkills([...skills, data.data])
      setNewSkill({ skillName: '', skillLevel: 'Beginner' })
      setSuccess('Skill added successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSkill = async (skillId, newLevel) => {
    try {
      await studentService.updateSkill(skillId, { skillLevel: newLevel })
      setSkills(skills.map(skill => 
        skill._id === skillId ? { ...skill, skillLevel: newLevel } : skill
      ))
      setSuccess('Skill updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skill')
    }
  }

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return

    try {
      await studentService.deleteSkill(skillId)
      setSkills(skills.filter(skill => skill._id !== skillId))
      setSuccess('Skill deleted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete skill')
    }
  }

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'badge-yellow'
      case 'Intermediate': return 'badge-blue'
      case 'Advanced': return 'badge-green'
      default: return 'badge-gray'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {error && (
        <div className="alert alert-error mb-4">
          {error}
          <button onClick={() => setError('')} className="float-right">&times;</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-4">
          {success}
          <button onClick={() => setSuccess('')} className="float-right">&times;</button>
        </div>
      )}

      {/* Profile Information */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Personal Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary btn-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={profileData.contactEmail}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                rows="4"
                className="form-textarea"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">GitHub Profile</label>
                <input
                  type="url"
                  name="githubLink"
                  value={profileData.githubLink}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="form-label">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedinLink"
                  value={profileData.linkedinLink}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="form-label">Portfolio Website</label>
                <input
                  type="url"
                  name="portfolioLink"
                  value={profileData.portfolioLink}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Register Number</p>
                <p className="font-medium">{user?.registerNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{user?.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-medium">{user?.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Section</p>
                <p className="font-medium">{user?.section || 'N/A'}</p>
              </div>
            </div>
            {user?.bio && (
              <div>
                <p className="text-sm text-gray-600">Bio</p>
                <p className="font-medium">{user.bio}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user?.githubLink && (
                <div>
                  <p className="text-sm text-gray-600">GitHub</p>
                  <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Profile
                  </a>
                </div>
              )}
              {user?.linkedinLink && (
                <div>
                  <p className="text-sm text-gray-600">LinkedIn</p>
                  <a href={user.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Profile
                  </a>
                </div>
              )}
              {user?.portfolioLink && (
                <div>
                  <p className="text-sm text-gray-600">Portfolio</p>
                  <a href={user.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skills Management */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Skills</h2>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Skill Name</label>
              <input
                type="text"
                value={newSkill.skillName}
                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                className="form-input"
                placeholder="e.g., React, Python, Figma"
              />
            </div>
            <div>
              <label className="form-label">Skill Level</label>
              <select
                value={newSkill.skillLevel}
                onChange={(e) => setNewSkill({ ...newSkill, skillLevel: e.target.value })}
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Skill'}
              </button>
            </div>
          </div>
        </form>

        {/* Skills List */}
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No skills added yet. Add your first skill above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{skill.skillName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={skill.skillLevel}
                    onChange={(e) => handleUpdateSkill(skill._id, e.target.value)}
                    className="form-select text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <span className={getSkillLevelColor(skill.skillLevel)}>
                    {skill.skillLevel}
                  </span>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile