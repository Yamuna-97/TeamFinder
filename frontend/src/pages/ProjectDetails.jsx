import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import projectService from '../services/projectService'
import { formatDate } from '../utils/formatDate'

const ProjectDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [applyMessage, setApplyMessage] = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const { data } = await projectService.getProject(id)
      setProject(data.data)
    } catch (err) {
      setError('Failed to load project details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    setApplying(true)
    setError('')
    setSuccess('')

    try {
      await projectService.applyToProject(id, applyMessage)
      setSuccess('Application submitted successfully!')
      setShowApplyForm(false)
      setApplyMessage('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Recruiting': return 'badge-green'
      case 'In Progress': return 'badge-blue'
      case 'Completed': return 'badge-yellow'
      case 'On Hold': return 'badge-red'
      default: return 'badge-gray'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="text-center py-8">
        <div className="alert alert-error">{error}</div>
        <Link to="/projects" className="btn-primary mt-4">
          Back to Projects
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Project Not Found</h2>
        <Link to="/projects" className="btn-primary">
          Browse Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/projects" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Projects
      </Link>

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

      <div className="card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <span className={getStatusColor(project.status)}>
              {project.status}
            </span>
          </div>
          {user && project.owner._id === user._id && (
            <Link
              to={`/projects/${project._id}/edit`}
              className="btn-secondary btn-sm"
            >
              Edit Project
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Details</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Domain:</span>
                <span className="ml-2 font-medium">{project.domain}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{project.projectType}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Level:</span>
                <span className="ml-2 font-medium">{project.projectLevel}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Meeting Mode:</span>
                <span className="ml-2 font-medium">{project.meetingMode}</span>
              </div>
              {project.location && (
                <div>
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{project.location}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Team Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Team Size:</span>
                <span className="ml-2 font-medium">
                  {project.currentMembers} / {project.teamSize} members
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Year Eligibility:</span>
                <span className="ml-2 font-medium">
                  {project.minimumYear} - {project.maximumYear}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Recruitment Deadline:</span>
                <span className="ml-2 font-medium">
                  {formatDate(project.recruitmentDeadline)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Project Deadline:</span>
                <span className="ml-2 font-medium">
                  {formatDate(project.deadline)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Progress:</span>
                <span className="ml-2 font-medium">{project.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
        </div>

        {project.skills && project.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <span key={index} className="badge badge-blue">
                  {skill.skillName} ({skill.requiredLevel})
                </span>
              ))}
            </div>
          </div>
        )}

        {project.mentorName && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Mentor</h3>
            <p className="font-medium">{project.mentorName}</p>
            {project.mentorEmail && (
              <p className="text-sm text-gray-600">{project.mentorEmail}</p>
            )}
          </div>
        )}

        {project.githubRepo && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Repository</h3>
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Repository
            </a>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Project Owner</h3>
          <div className="flex items-center gap-4">
            <div>
              <p className="font-medium">{project.owner.name}</p>
              <p className="text-sm text-gray-600">{project.owner.department}</p>
              <p className="text-sm text-gray-600">Year {project.owner.year}</p>
            </div>
          </div>
        </div>

        {/* Team Members */}
        {project.team && project.team.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Team Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.team.map((member, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{member.student.name}</p>
                  <p className="text-sm text-gray-600">{member.student.department}</p>
                  <p className="text-sm text-gray-600">Year {member.student.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        {user && project.status === 'Recruiting' && project.owner._id !== user._id && (
          <div className="border-t pt-6">
            {!showApplyForm ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="btn-primary btn-lg"
              >
                Apply to Join
              </button>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="text-lg font-semibold">Application Message</h3>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="form-textarea"
                  rows="4"
                  placeholder="Tell the project owner why you'd like to join..."
                />
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary" disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDetails