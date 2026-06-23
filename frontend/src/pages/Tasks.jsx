import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import taskService from '../services/taskService'
import projectService from '../services/projectService'
import TaskCard from '../components/TaskCard'
import { calculateProgress } from '../utils/calculateProgress'

const Tasks = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: ''
  })

  useEffect(() => {
    fetchData()
  }, [projectId])

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProject(projectId),
        taskService.getProjectTasks(projectId)
      ])
      setProject(projectRes.data)
      setTasks(tasksRes.data)
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await taskService.createTask(projectId, newTask)
      setShowCreateForm(false)
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
      })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    }
  }

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus })
      fetchData()
    } catch (err) {
      setError('Failed to update task status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await taskService.deleteTask(taskId)
      fetchData()
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const isOwner = project?.owner?._id === user?._id
  const teamMembers = project?.team || []
  const progress = calculateProgress(tasks)

  const todoTasks = tasks.filter(t => t.status === 'To Do')
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress')
  const completedTasks = tasks.filter(t => t.status === 'Completed')

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Task Management</h1>
          {project && (
            <p className="text-gray-600">Project: {project.title}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/projects/${projectId}`} className="btn-secondary">
            View Project
          </Link>
          {isOwner && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary"
            >
              {showCreateForm ? 'Cancel' : 'Create Task'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          {error}
          <button onClick={() => setError('')} className="float-right">&times;</button>
        </div>
      )}

      {/* Progress Overview */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">To Do</p>
            <p className="text-2xl font-bold text-yellow-600">{todoTasks.length}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-purple-600">{inProgressTasks.length}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
          </div>
        </div>
        <div className="bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Overall Progress: {progress}%</p>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="space-y-4">
              <div>
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Assign To *</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">Select Member</option>
                    {teamMembers.map((member) => (
                      <option key={member.student?._id} value={member.student?._id}>
                        {member.student?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-6">
        {/* To Do Tasks */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            To Do ({todoTasks.length})
          </h3>
          <div className="space-y-4">
            {todoTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isOwner={isOwner}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
              />
            ))}
            {todoTasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tasks to do</p>
            )}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            In Progress ({inProgressTasks.length})
          </h3>
          <div className="space-y-4">
            {inProgressTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isOwner={isOwner}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
              />
            ))}
            {inProgressTasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tasks in progress</p>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-4">
            {completedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isOwner={isOwner}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTask}
              />
            ))}
            {completedTasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">No completed tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tasks