import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import projectService from '../services/projectService'

const categoryTabs = [
  { label: 'All', value: '' },
  { label: 'Web Development', value: 'Web Development' },
  { label: 'AI / ML', value: 'Machine Learning' },
  { label: 'Mobile App', value: 'Mobile Development' },
  { label: 'Blockchain', value: 'Blockchain' },
  { label: 'IoT', value: 'IoT' },
  { label: 'Game Development', value: 'Game Development' },
  { label: 'Open Source', value: 'Open Source' },
]

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeTab) params.domain = activeTab
      if (search) params.search = search
      if (sort) params.sort = sort

      const { data } = await projectService.getProjects(params)
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, sort])

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 300)
    return () => clearTimeout(timer)
  }, [fetchProjects])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Projects</h1>
        <p className="text-sm text-gray-500 mt-1">Discover and join exciting projects to build together</p>
      </div>

      {/* Search + Filter + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects by title, skills, or keywords..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilterPanel(p => !p)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold shadow-sm transition ${
            showFilterPanel
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
          >
            <option value="newest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="deadline">Sort by: Deadline</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Category Tab Pills */}
      <div className="flex flex-wrap gap-2 mb-7">
        {categoryTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
              activeTab === tab.value
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <Link
          to="/projects/create"
          className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white border border-blue-600 shadow-sm hover:bg-blue-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Project
        </Link>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">No projects found</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Try adjusting your search or category filter, or be the first to create one!
          </p>
          <Link
            to="/projects/create"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-sm"
          >
            Create a Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects