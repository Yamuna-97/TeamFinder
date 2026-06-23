import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import projectService from '../services/projectService'
import taskService from '../services/taskService'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    myProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    teamMembers: 0
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch my projects
        const myProjectsData = await projectService.getMyProjects()
        setRecentProjects(myProjectsData.data.slice(0, 5))
        
        // Fetch my tasks
        const myTasksData = await taskService.getMyTasks()
        setMyTasks(myTasksData.data.slice(0, 5))
        
        // Calculate stats
        const pendingTasks = myTasksData.data.filter(t => t.status !== 'Completed').length
        const completedTasks = myTasksData.data.filter(t => t.status === 'Completed').length
        
        setStats({
          totalProjects: myProjectsData.count,
          myProjects: myProjectsData.count,
          totalTasks: myTasksData.count,
          pendingTasks,
          completedTasks,
          teamMembers: 0 // Will be calculated from team members
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Welcome Message */}
      <div className="card mb-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100">
          {user?.department} • Year {user?.year} • {user?.registerNumber}
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-blue-600">{stats.myProjects}</p>
            </div>
            <span className="text-4xl">📁</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalTasks}</p>
            </div>
            <span className="text-4xl">📋</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
      </div>
      
      {/* Recent Projects and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Projects</h3>
            <Link to="/my-projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No projects yet</p>
              <Link to="/projects/create" className="btn-primary">
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div key={project._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Link to={`/projects/${project._id}`} className="font-medium text-gray-900 hover:text-blue-600">
                      {project.title}
                    </Link>
                    <p className="text-sm text-gray-600">{project.domain}</p>
                  </div>
                  <span className={`badge ${
                    project.status === 'In Progress' ? 'badge-blue' :
                    project.status === 'Recruiting' ? 'badge-green' :
                    project.status === 'Completed' ? 'badge-yellow' : 'badge-red'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* My Tasks */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">My Tasks</h3>
          </div>
          {myTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.map(task => (
                <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    {task.project && (
                      <p className="text-sm text-gray-600">{task.project.title}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${
                    task.status === 'Completed' ? 'badge-green' :
                    task.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard