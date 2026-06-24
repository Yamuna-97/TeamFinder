import React from 'react'
import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Recruiting':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border border-blue-100'
      case 'Completed':
        return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'On Hold':
        return 'bg-rose-50 text-rose-700 border border-rose-100'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-100'
    }
  }

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative">
      <div>
        <div className="flex justify-between items-start mb-3.5 gap-2">
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-tight hover:text-blue-600 transition-colors">
            <Link to={`/projects/${project._id}`}>{project.title}</Link>
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        {/* Domain & Type Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
            {project.domain}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600">
            {project.projectType}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500">
            {project.projectLevel}
          </span>
        </div>

        {/* Required Skills if any */}
        {project.skills && project.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Required Skills</p>
            <div className="flex flex-wrap gap-1">
              {project.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-750 font-semibold">
                  {skill.skillName}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-400 font-medium">
                  +{project.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 border-t border-gray-50 pt-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Size: <strong className="text-gray-700">{project.currentMembers || 1}/{project.teamSize}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Year: <strong className="text-gray-700">{project.minimumYear}-{project.maximumYear}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Mode: <strong className="text-gray-700">{project.meetingMode}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <span>Progress: <strong className="text-gray-700">{project.progress}%</strong></span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-auto">
        <Link
          to={`/projects/${project._id}`}
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
        >
          View Details
        </Link>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          Deadline: {new Date(project.recruitmentDeadline).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

export default ProjectCard