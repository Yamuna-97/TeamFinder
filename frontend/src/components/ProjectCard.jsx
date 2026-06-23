import React from 'react'
import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Recruiting': return 'badge-green'
      case 'In Progress': return 'badge-blue'
      case 'Completed': return 'badge-yellow'
      case 'On Hold': return 'badge-red'
      default: return 'badge-blue'
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
        <span className={getStatusColor(project.status)}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge-blue">{project.domain}</span>
        <span className="badge-blue">{project.projectType}</span>
        <span className="badge-blue">{project.projectLevel}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Team Size:</span> {project.currentMembers}/{project.teamSize}
        </div>
        <div>
          <span className="font-medium">Year:</span> {project.minimumYear}-{project.maximumYear}
        </div>
        <div>
          <span className="font-medium">Mode:</span> {project.meetingMode}
        </div>
        <div>
          <span className="font-medium">Progress:</span> {project.progress}%
        </div>
      </div>

      {project.owner && (
        <div className="text-sm text-gray-500 mb-4">
          Created by: {project.owner.name}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link
          to={`/projects/${project._id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
        <span className="text-xs text-gray-500">
          Deadline: {new Date(project.recruitmentDeadline).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

export default ProjectCard