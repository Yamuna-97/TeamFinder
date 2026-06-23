import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import projectService from '../services/projectService'

const EditProject = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    projectType: '',
    projectLevel: 'Beginner',
    teamSize: 2,
    minimumYear: 1,
    maximumYear: 5,
    meetingMode: 'Online',
    location: '',
    recruitmentDeadline: '',
    deadline: '',
    githubRepo: '',
    mentorName: '',
    mentorEmail: '',
    status: 'Recruiting',
    skills: []
  })

  const domains = [
    'Web Development', 'Mobile Development', 'Machine Learning',
    'Data Science', 'Artificial Intelligence', 'Cloud Computing',
    'Cybersecurity', 'Blockchain', 'IoT', 'Game Development', 'DevOps', 'Other'
  ]

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const { data } = await projectService.getProject(id)
      const project = data.data
      setFormData({
        title: project.title,
        description: project.description,
        domain: project.domain,
        projectType: project.projectType,
        projectLevel: project.projectLevel,
        teamSize: project.teamSize,
        minimumYear: project.minimumYear,
        maximumYear: project.maximumYear,
        meetingMode: project.meetingMode,
        location: project.location || '',
        recruitmentDeadline: new Date(project.recruitmentDeadline).toISOString().split('T')[0],
        deadline: new Date(project.deadline).toISOString().split('T')[0],
        githubRepo: project.githubRepo || '',
        mentorName: project.mentorName || '',
        mentorEmail: project.mentorEmail || '',
        status: project.status,
        skills: project.skills?.length > 0 ? project.skills : [{ skillName: '', requiredLevel: 'Beginner' }]
      })
    } catch (err) {
      setError('Failed to load project')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills]
    updatedSkills[index][field] = value
    setFormData({ ...formData, skills: updatedSkills })
  }

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { skillName: '', requiredLevel: 'Beginner' }]
    })
  }

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const projectData = {
        ...formData,
        skills: formData.skills.filter(skill => skill.skillName.trim() !== ''),
        teamSize: parseInt(formData.teamSize),
        minimumYear: parseInt(formData.minimumYear),
        maximumYear: parseInt(formData.maximumYear)
      }

      await projectService.updateProject(id, projectData)
      navigate(`/projects/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="text-center py-8">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>

      {error && (
        <div className="alert alert-error mb-4">
          {error}
          <button onClick={() => setError('')} className="float-right">&times;</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="6"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Domain *</label>
                <select name="domain" value={formData.domain} onChange={handleChange} className="form-select" required>
                  <option value="">Select Domain</option>
                  {domains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-select" required>
                  <option value="Recruiting">Recruiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="form-label">Project Type *</label>
                <input
                  type="text"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Project Level *</label>
                <select name="projectLevel" value={formData.projectLevel} onChange={handleChange} className="form-select" required>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="form-label">Meeting Mode *</label>
                <select name="meetingMode" value={formData.meetingMode} onChange={handleChange} className="form-select" required>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {formData.meetingMode !== 'Online' && (
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Team Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Team Size *</label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="20"
                required
              />
            </div>

            <div>
              <label className="form-label">Minimum Year *</label>
              <input
                type="number"
                name="minimumYear"
                value={formData.minimumYear}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="5"
                required
              />
            </div>

            <div>
              <label className="form-label">Maximum Year *</label>
              <input
                type="number"
                name="maximumYear"
                value={formData.maximumYear}
                onChange={handleChange}
                className="form-input"
                min="1"
                max="5"
                required
              />
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Required Skills</h2>
            <button type="button" onClick={addSkill} className="btn-secondary btn-sm">
              Add Skill
            </button>
          </div>
          {formData.skills.map((skill, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
              <div>
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  value={skill.skillName}
                  onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Required Level</label>
                <select
                  value={skill.requiredLevel}
                  onChange={(e) => handleSkillChange(index, 'requiredLevel', e.target.value)}
                  className="form-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                {formData.skills.length > 1 && (
                  <button type="button" onClick={() => removeSkill(index)} className="btn-danger btn-sm">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary btn-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProject