import axios from 'axios'

const API_URL = '/api/tasks'

// Get auth config
const getConfig = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// Get project tasks
const getProjectTasks = async (projectId) => {
  const response = await axios.get(`${API_URL}/project/${projectId}`, getConfig())
  return response.data
}

// Create task
const createTask = async (projectId, taskData) => {
  const response = await axios.post(`${API_URL}/project/${projectId}`, taskData, getConfig())
  return response.data
}

// Update task
const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, getConfig())
  return response.data
}

// Delete task
const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getConfig())
  return response.data
}

// Get my tasks
const getMyTasks = async () => {
  const response = await axios.get(`${API_URL}/my-tasks`, getConfig())
  return response.data
}

// Get task stats
const getTaskStats = async (projectId) => {
  const response = await axios.get(`${API_URL}/stats/${projectId}`, getConfig())
  return response.data
}

const taskService = {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getTaskStats
}

export default taskService