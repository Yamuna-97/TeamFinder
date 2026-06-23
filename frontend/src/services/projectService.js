import axios from 'axios'

const API_URL = '/api/projects'

// Get auth config
const getConfig = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// Get all projects
const getProjects = async (params = {}) => {
  const response = await axios.get(API_URL, { params })
  return response.data
}

// Get single project
const getProject = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

// Create project
const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData, getConfig())
  return response.data
}

// Update project
const updateProject = async (id, projectData) => {
  const response = await axios.put(`${API_URL}/${id}`, projectData, getConfig())
  return response.data
}

// Delete project
const deleteProject = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig())
  return response.data
}

// Get my projects
const getMyProjects = async () => {
  const response = await axios.get(`${API_URL}/my/projects`, getConfig())
  return response.data
}

// Apply to project
const applyToProject = async (id, message) => {
  const response = await axios.post(`${API_URL}/${id}/apply`, { message }, getConfig())
  return response.data
}

// Get join requests
const getJoinRequests = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/requests`, getConfig())
  return response.data
}

// Handle join request
const handleJoinRequest = async (projectId, requestId, status) => {
  const response = await axios.put(
    `${API_URL}/${projectId}/requests/${requestId}`,
    { status },
    getConfig()
  )
  return response.data
}

// Search projects
const searchProjects = async (params) => {
  const response = await axios.get(`${API_URL}/search`, { params })
  return response.data
}

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  applyToProject,
  getJoinRequests,
  handleJoinRequest,
  searchProjects
}

export default projectService