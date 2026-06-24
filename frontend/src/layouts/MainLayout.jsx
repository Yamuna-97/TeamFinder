import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  const location = useLocation()
  
  const dashboardRoutes = [
    '/dashboard',
    '/profile',
    '/find-teammates',
    '/projects/create',
    '/my-projects',
    '/team',
    '/tasks'
  ]
  
  const isDashboardRoute = dashboardRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  )
}

export default MainLayout