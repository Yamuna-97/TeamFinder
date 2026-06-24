import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import projectService from '../services/projectService'

const statusConfig = {
  'Recruiting':   { pill: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-400' },
  'In Progress':  { pill: 'bg-blue-50 text-blue-700 border border-blue-100',          dot: 'bg-blue-400' },
  'Completed':    { pill: 'bg-amber-50 text-amber-700 border border-amber-100',        dot: 'bg-amber-400' },
  'On Hold':      { pill: 'bg-rose-50 text-rose-700 border border-rose-100',           dot: 'bg-rose-400' },
}

const MyProjects = () => {
  const [projects, setProjects]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [joinRequests, setJoinRequests]   = useState([])
  const [showRequests, setShowRequests]   = useState(false)
  const [toast, setToast]                 = useState({ type: '', msg: '' })

  const notify = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast({ type: '', msg: '' }), 3500)
  }

  useEffect(() => { fetchMyProjects() }, [])

  const fetchMyProjects = async () => {
    try {
      const { data } = await projectService.getMyProjects()
      setProjects(data)
    } catch (e) {
      console.error(e)
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
    } catch (e) { console.error(e) }
  }

  const handleRequest = async (requestId, status) => {
    try {
      await projectService.handleJoinRequest(selectedProject, requestId, status)
      notify('success', `Request ${status.toLowerCase()} successfully!`)
      handleViewRequests(selectedProject)
      fetchMyProjects()
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to handle request')
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await projectService.deleteProject(projectId)
      setProjects(projects.filter(p => p._id !== projectId))
      notify('success', 'Project deleted successfully!')
    } catch (err) {
      notify('error', err.response?.data?.message || 'Failed to delete project')
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">

      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold transition-all ${
          toast.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toast.type === 'success'
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all your projects</p>
        </div>
        <Link
          to="/projects/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Project
        </Link>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-4">📁</div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">No projects yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">Create your first project and start building your dream team!</p>
          <Link to="/projects/create" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-sm">
            Create a Project
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map(project => {
            const status = statusConfig[project.status] || statusConfig['On Hold']
            const progress = project.progress || 0
            return (
              <div key={project._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">{project.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
                        {project.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">{project.domain}</span>
                      {project.projectType && <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600">{project.projectType}</span>}
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500">{project.projectLevel}</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/projects/${project._id}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                      View
                    </Link>
                    <Link to={`/projects/${project._id}/edit`} className="px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(project._id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress</span>
                    <span className="text-xs font-bold text-gray-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Team: <strong className="text-gray-700">{project.currentMembers}/{project.teamSize}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Deadline: <strong className="text-gray-700">{new Date(project.recruitmentDeadline).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Mode: <strong className="text-gray-700">{project.meetingMode}</strong></span>
                  </div>
                </div>

                {/* Skills */}
                {project.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600">{s.skillName}</span>
                    ))}
                  </div>
                )}

                {/* Bottom actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                  <Link to={`/team/${project._id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Manage Team
                  </Link>
                  <Link to={`/tasks/${project._id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Manage Tasks
                  </Link>
                  <button
                    onClick={() => handleViewRequests(project._id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm ml-auto"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Join Requests
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Join Requests Modal */}
      {showRequests && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900">Join Requests</h2>
              <button onClick={() => setShowRequests(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition text-lg">
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-6 flex-1">
              {joinRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-semibold">No join requests yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map(req => (
                    <div key={req._id} className="bg-gray-50 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {req.student?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{req.student?.name}</p>
                            <p className="text-xs text-gray-500">{req.student?.department} · Year {req.student?.year}</p>
                          </div>
                        </div>
                        {req.message && (
                          <p className="text-sm text-gray-600 mt-2 pl-10">"{req.message}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {req.status === 'Pending' ? (
                          <>
                            <button onClick={() => handleRequest(req._id, 'Accepted')} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                              Accept
                            </button>
                            <button onClick={() => handleRequest(req._id, 'Rejected')} className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-100 transition">
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            req.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProjects