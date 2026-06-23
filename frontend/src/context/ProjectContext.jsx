import React, { createContext, useContext, useReducer } from 'react'
import projectService from '../services/projectService'

const ProjectContext = createContext()

const initialState = {
  projects: [],
  currentProject: null,
  myProjects: [],
  joinRequests: [],
  loading: false,
  error: null,
  filters: {
    domain: '',
    projectType: '',
    status: '',
    search: '',
    sort: 'newest'
  }
}

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  SET_MY_PROJECTS: 'SET_MY_PROJECTS',
  SET_JOIN_REQUESTS: 'SET_JOIN_REQUESTS',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer
const projectReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload, loading: false }
    
    case ActionTypes.SET_CURRENT_PROJECT:
      return { ...state, currentProject: action.payload, loading: false }
    
    case ActionTypes.SET_MY_PROJECTS:
      return { ...state, myProjects: action.payload, loading: false }
    
    case ActionTypes.SET_JOIN_REQUESTS:
      return { ...state, joinRequests: action.payload, loading: false }
    
    case ActionTypes.ADD_PROJECT:
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        myProjects: [action.payload, ...state.myProjects],
        loading: false
      }
    
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
        myProjects: state.myProjects.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
        currentProject: state.currentProject?._id === action.payload._id
          ? action.payload
          : state.currentProject,
        loading: false
      }
    
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(p => p._id !== action.payload),
        myProjects: state.myProjects.filter(p => p._id !== action.payload),
        currentProject: state.currentProject?._id === action.payload
          ? null
          : state.currentProject,
        loading: false
      }
    
    case ActionTypes.UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    
    default:
      return state
  }
}

// Provider Component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  // Actions
  const fetchProjects = async (params = {}) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.getProjects({ ...state.filters, ...params })
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: data })
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch projects'
      })
    }
  }

  const fetchProject = async (id) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.getProject(id)
      dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: data.data })
      return data.data
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch project'
      })
      return null
    }
  }

  const createProject = async (projectData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.createProject(projectData)
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: data.data })
      return data.data
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to create project'
      })
      throw error
    }
  }

  const updateProject = async (id, projectData) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.updateProject(id, projectData)
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: data.data })
      return data.data
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to update project'
      })
      throw error
    }
  }

  const deleteProject = async (id) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      await projectService.deleteProject(id)
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: id })
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to delete project'
      })
      throw error
    }
  }

  const fetchMyProjects = async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.getMyProjects()
      dispatch({ type: ActionTypes.SET_MY_PROJECTS, payload: data })
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch your projects'
      })
    }
  }

  const fetchJoinRequests = async (projectId) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.getJoinRequests(projectId)
      dispatch({ type: ActionTypes.SET_JOIN_REQUESTS, payload: data })
      return data
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch join requests'
      })
      throw error
    }
  }

  const handleJoinRequest = async (projectId, requestId, status) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true })
    try {
      const { data } = await projectService.handleJoinRequest(projectId, requestId, status)
      // Refresh join requests
      await fetchJoinRequests(projectId)
      return data
    } catch (error) {
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: error.response?.data?.message || 'Failed to handle request'
      })
      throw error
    }
  }

  const updateFilters = (newFilters) => {
    dispatch({ type: ActionTypes.UPDATE_FILTERS, payload: newFilters })
  }

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR })
  }

  const value = {
    ...state,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchMyProjects,
    fetchJoinRequests,
    handleJoinRequest,
    updateFilters,
    clearError,
    dispatch
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

// Custom hook to use project context
export const useProjectContext = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider')
  }
  return context
}

export default ProjectContext