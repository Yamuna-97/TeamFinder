import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import projectService from '../services/projectService'
import { formatDate } from '../utils/formatDate'

const MyProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [joinRequests, setJoinRequests] = useState([])
  const [showRequests, setShowRequests] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchMyProjects()
  }, [])

  const fetchMyProjects = async () => {
    try {
      const { data } = await projectService.getMyProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewRequests = async (projectId) => {
    try {
      const { data } = await projectService.getJoinRequests(projectId)
      setJoinRequests(data)
      setSelectedProject(projectId)
      setShowRequests(true)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const handleRequest = async (requestId, status) => {
    try {
      await projectService.handleJoinRequest(selectedProject, requestId, status)
      setSuccess(`Request ${status.toLowerCase()} successfully!`)
      // Refresh requests
      handleViewRequests(selectedProject)
      // Refresh projects
      fetchMyProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to handle request')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await projectService.deleteProject(projectId)
      setProjects(projects.filter(p => p._id !== projectId))
      setSuccess('Project deleted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project')
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Link to="/projects/create" className="btn-primary">
          Create New Project
        </Link>
      </div>

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

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Create your first project and start building your team!</p>
          <Link to="/projects/create" className="btn-primary">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <div key={project._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <span className={getStatusColor(project.status)}>
                    {project.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/projects/${project._id}`}
                    className="btn-secondary btn-sm"
                  >
                    View
                  </Link>
                  <Link
                    to={`/projects/${project._id}/edit`}
                    className="btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Team:</span>
                  <span className="ml-2 font-medium">
                    {project.currentMembers} / {project.teamSize} members
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Recruitment:</span>
                  <span className="ml-2 font-medium">
                    {formatDate(project.recruitmentDeadline)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="ml-2 font-medium">{project.progress}%</span>
                </div>
              </div>

              {project.skills && project.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="badge badge-blue">
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  to={`/team/${project._id}`}
                  className="btn-secondary btn-sm"
                >
                  Manage Team
                </Link>
                <Link
                  to={`/tasks/${project._id}`}
                  className="btn-secondary btn-sm"
                >
                  Manage Tasks
                </Link>
                <button
                  onClick={() => handleViewRequests(project._id)}
                  className="btn-primary btn-sm"
                >
                  View Join Requests
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Join Requests</h2>
              <button
                onClick={() => setShowRequests(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {joinRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No join requests yet</p>
            ) : (
              <div className="space-y-4">
                {joinRequests.map(request => (
                  <div key={request._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{request.student?.name}</p>
                        <p className="text-sm text-gray-600">{request.student?.department}</p>
                        <p className="text-sm text-gray-600">Year {request.student?.year}</p>
                      </div>
                      <span className={`badge ${
                        request.status === 'Pending' ? 'badge-yellow' :
                        request.status === 'Accepted' ? 'badge-green' : 'badge-red'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    {request.message && (
                      <p className="text-sm text-gray-700 mb-2">
                        Message: {request.message}
                      </p>
                    )}
                    {request.status === 'Pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleRequest(request._id, 'Accepted')}
                          className="btn-success btn-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequest(request._id, 'Rejected')}
                          className="btn-danger btn-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProjects