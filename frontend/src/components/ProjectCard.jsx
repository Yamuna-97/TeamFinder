import React from 'react'
import { Link } from 'react-router-dom'

// Domain icon mapping
const domainIcon = (domain = '') => {
  const d = domain.toLowerCase()
  if (d.includes('machine learning') || d.includes('ai') || d.includes('artificial'))
    return { bg: 'bg-purple-100', text: 'text-purple-600', icon: '🤖' }
  if (d.includes('web'))
    return { bg: 'bg-green-100', text: 'text-green-600', icon: '🌐' }
  if (d.includes('mobile'))
    return { bg: 'bg-orange-100', text: 'text-orange-600', icon: '📱' }
  if (d.includes('blockchain'))
    return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: '⛓️' }
  if (d.includes('iot'))
    return { bg: 'bg-teal-100', text: 'text-teal-600', icon: '📡' }
  if (d.includes('game'))
    return { bg: 'bg-red-100', text: 'text-red-600', icon: '🎮' }
  if (d.includes('cloud'))
    return { bg: 'bg-sky-100', text: 'text-sky-600', icon: '☁️' }
  if (d.includes('data'))
    return { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: '📊' }
  if (d.includes('open source'))
    return { bg: 'bg-lime-100', text: 'text-lime-600', icon: '🔓' }
  return { bg: 'bg-blue-100', text: 'text-blue-600', icon: '💻' }
}

// Domain pill color
const domainPill = (domain = '') => {
  const d = domain.toLowerCase()
  if (d.includes('machine learning') || d.includes('ai') || d.includes('artificial'))
    return 'bg-orange-50 text-orange-600 border border-orange-100'
  if (d.includes('web'))
    return 'bg-blue-50 text-blue-600 border border-blue-100'
  if (d.includes('mobile'))
    return 'bg-purple-50 text-purple-600 border border-purple-100'
  if (d.includes('blockchain'))
    return 'bg-yellow-50 text-yellow-700 border border-yellow-100'
  if (d.includes('iot'))
    return 'bg-teal-50 text-teal-600 border border-teal-100'
  if (d.includes('game'))
    return 'bg-red-50 text-red-600 border border-red-100'
  return 'bg-indigo-50 text-indigo-600 border border-indigo-100'
}

// How long ago
const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return '1 day ago'
  return `${diff} days ago`
}

const ProjectCard = ({ project }) => {
  const iconStyle = domainIcon(project.domain)
  const pillStyle = domainPill(project.domain)
  const ownerInitial = project.owner?.name ? project.owner.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">

      {/* Top row: icon + domain pill + bookmark */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${iconStyle.bg}`}>
            {iconStyle.icon}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pillStyle}`}>
            {project.domain || 'General'}
          </span>
        </div>
        <button className="text-gray-300 hover:text-blue-400 transition-colors mt-0.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="text-base font-extrabold text-gray-900 mb-1.5 leading-snug hover:text-blue-600 transition-colors">
        <Link to={`/projects/${project._id}`}>{project.title}</Link>
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Creator row */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50">
        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {ownerInitial}
        </div>
        <span className="text-sm font-semibold text-gray-700">{project.owner?.name || 'Unknown'}</span>
        <span className="text-xs text-gray-400 ml-auto">
          Posted {timeAgo(project.createdAt)}
        </span>
      </div>

      {/* Stats: Team Size + Level */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Team Size</p>
            <p className="text-sm font-bold text-gray-800">{project.teamSize}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Level</p>
            <p className="text-sm font-bold text-gray-800">{project.projectLevel}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {project.skills && project.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {project.skills.slice(0, 4).map((s, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">
                {s.skillName}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-400">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5 mt-auto pt-3 border-t border-gray-50">
        <Link
          to={`/projects/${project._id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
        >
          View Details
        </Link>
        <button className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm">
          Join Team
        </button>
      </div>
    </div>
  )
}

export default ProjectCard