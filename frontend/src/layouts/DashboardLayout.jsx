import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashboardLayout = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/projects', label: 'Browse Projects', icon: '🔍' },
    { path: '/my-projects', label: 'My Projects', icon: '📁' },
    { path: '/projects/create', label: 'Create Project', icon: '➕' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-white shadow-lg`}>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">TeamFinder</h2>
          {user && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.department}</p>
              <p className="text-sm text-gray-600">Year {user.year}</p>
            </div>
          )}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-blue-600">TeamFinder</h1>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout