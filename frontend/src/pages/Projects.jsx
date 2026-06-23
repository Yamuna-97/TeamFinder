import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import projectService from '../services/projectService'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    domain: '',
    projectType: '',
    status: '',
    search: '',
    sort: 'newest'
  })

  const domains = [
    'Web Development',
    'Mobile Development',
    'Machine Learning',
    'Data Science',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain',
    'IoT',
    'Game Development',
    'DevOps',
    'Other'
  ]

  const projectTypes = [
    'Web Application',
    'Mobile App',
    'Desktop Application',
    'API/Backend',
    'Research',
    'Open Source',
    'Other'
  ]

  const statuses = ['Recruiting', 'In Progress', 'Completed', 'On Hold']

  useEffect(() => {
    fetchProjects()
  }, [filters])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.domain) params.domain = filters.domain
      if (filters.projectType) params.projectType = filters.projectType
      if (filters.status) params.status = filters.status
      if (filters.search) params.search = filters.search
      if (filters.sort) params.sort = filters.sort

      const { data } = await projectService.getProjects(params)
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({
      domain: '',
      projectType: '',
      status: '',
      search: '',
      sort: 'newest'
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Projects</h1>
        <Link to="/projects/create" className="btn-primary">
          Create Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search projects..."
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Domain</label>
            <select
              name="domain"
              value={filters.domain}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Domains</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Project Type</label>
            <select
              name="projectType"
              value={filters.projectType}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Types</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deadline">Recruitment Deadline</option>
            </select>
          </div>
        </div>
        <button
          onClick={clearFilters}
          className="btn-secondary mt-4"
        >
          Clear Filters
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="spinner"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or create a new project</p>
          <Link to="/projects/create" className="btn-primary">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-1 md:grid-2 lg:grid-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects