import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import projectService from '../services/projectService'
import TeamCard from '../components/TeamCard'

const Team = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [team, setTeam] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTeamData()
  }, [projectId])

  const fetchTeamData = async () => {
    try {
      const projectRes = await projectService.getProject(projectId)
      setProject(projectRes.data)
    } catch (err) {
      console.error('Error fetching team data:', err)
      setError('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return

    try {
      // Implementation for removing team member
      setError('')
      fetchTeamData()
    } catch (err) {
      setError('Failed to remove team member')
    }
  }

  const isOwner = project?.owner?._id === user?._id

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="alert alert-error">{error}</div>
        <Link to="/my-projects" className="btn-primary mt-4">
          Back to My Projects
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          {project && (
            <p className="text-gray-600">
              Project: {project.title}
            </p>
          )}
        </div>
        <Link to={`/projects/${projectId}`} className="btn-secondary">
          View Project
        </Link>
      </div>

      {/* Team Overview */}
      {project && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-2xl font-bold text-blue-600">
                {project.currentMembers} / {project.teamSize}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Project Status</p>
              <p className="text-2xl font-bold text-green-600">
                {project.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {project.progress}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Team Members</h2>

        {project?.team && project.team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.team.map((member, index) => (
              <TeamCard
                key={index}
                member={member}
                isOwner={isOwner}
                isCurrentUser={member.student?._id === user?._id}
                onRemove={handleRemoveMember}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No team members yet</p>
          </div>
        )}

        {/* Pending Join Requests Summary */}
        {isOwner && (
          <div className="mt-8 pt-6 border-t">
            <Link
              to={`/my-projects`}
              className="btn-primary"
            >
              Manage Join Requests
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Team