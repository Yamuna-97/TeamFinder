import { useState, useEffect, useCallback } from 'react'
import projectService from '../services/projectService'

const useProjects = (initialFilters = {}) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      }
      
      const { data, count } = await projectService.getProjects(params)
      setProjects(data)
      setPagination(prev => ({
        ...prev,
        total: count || data.length
      }))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  // Fetch single project
  const getProject = async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data } = await projectService.getProject(id)
      return data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch project')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create project
  const createProject = async (projectData) => {
    setError(null)
    
    try {
      const { data } = await projectService.createProject(projectData)
      setProjects(prev => [data.data, ...prev])
      return data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
      throw err
    }
  }

  // Update project
  const updateProject = async (id, projectData) => {
    setError(null)
    
    try {
      const { data } = await projectService.updateProject(id, projectData)
      setProjects(prev => 
        prev.map(project => 
          project._id === id ? { ...project, ...data.data } : project
        )
      )
      return data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project')
      throw err
    }
  }

  // Delete project
  const deleteProject = async (id) => {
    setError(null)
    
    try {
      await projectService.deleteProject(id)
      setProjects(prev => prev.filter(project => project._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project')
      throw err
    }
  }

  // Apply to project
  const applyToProject = async (id, message = '') => {
    setError(null)
    
    try {
      const { data } = await projectService.applyToProject(id, message)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply to project')
      throw err
    }
  }

  // Get join requests
  const getJoinRequests = async (id) => {
    setError(null)
    
    try {
      const { data } = await projectService.getJoinRequests(id)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch join requests')
      throw err
    }
  }

  // Handle join request
  const handleJoinRequest = async (projectId, requestId, status) => {
    setError(null)
    
    try {
      const { data } = await projectService.handleJoinRequest(projectId, requestId, status)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to handle request')
      throw err
    }
  }

  // Search projects
  const searchProjects = async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data } = await projectService.searchProjects(query)
      setProjects(data)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search projects')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Pagination controls
  const nextPage = () => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, Math.ceil(prev.total / prev.limit))
    }))
  }

  const prevPage = () => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1)
    }))
  }

  const goToPage = (page) => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(Math.max(page, 1), Math.ceil(prev.total / prev.limit))
    }))
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    filters,
    pagination,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    applyToProject,
    getJoinRequests,
    handleJoinRequest,
    searchProjects,
    updateFilters,
    clearFilters,
    nextPage,
    prevPage,
    goToPage,
    setError
  }
}

export default useProjects