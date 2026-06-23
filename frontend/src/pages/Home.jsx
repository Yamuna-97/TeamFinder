import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import projectService from '../services/projectService'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await projectService.getProjects({ limit: 6 })
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Project Teammates
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with skilled students, create amazing projects, and build your dream team
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/projects"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why TeamFinder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Find Teammates</h3>
              <p className="text-gray-600">
                Search for students based on skills, department, and year to find the perfect match
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Manage Projects</h3>
              <p className="text-gray-600">
                Create projects, set requirements, and recruit the best team members
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Assign tasks, monitor progress, and ensure project success
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Projects</h2>
          {loading ? (
            <div className="text-center">Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/projects" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home