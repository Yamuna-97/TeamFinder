import axios from 'axios'

const API_URL = '/api/students'

// Get auth config
const getConfig = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// Get all students
const getStudents = async (params = {}) => {
  const response = await axios.get(API_URL, { params })
  return response.data
}

// Get single student
const getStudent = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

// Get my skills
const getMySkills = async () => {
  const response = await axios.get(`${API_URL}/skills/mine`, getConfig())
  return response.data
}

// Add skill
const addSkill = async (skillData) => {
  const response = await axios.post(`${API_URL}/skills`, skillData, getConfig())
  return response.data
}

// Update skill
const updateSkill = async (id, skillData) => {
  const response = await axios.put(`${API_URL}/skills/${id}`, skillData, getConfig())
  return response.data
}

// Delete skill
const deleteSkill = async (id) => {
  const response = await axios.delete(`${API_URL}/skills/${id}`, getConfig())
  return response.data
}

const studentService = {
  getStudents,
  getStudent,
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill
}

export default studentService