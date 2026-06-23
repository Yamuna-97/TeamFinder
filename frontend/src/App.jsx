import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import CreateProject from './pages/CreateProject'
import EditProject from './pages/EditProject'
import MyProjects from './pages/MyProjects'
import Team from './pages/Team'
import Tasks from './pages/Tasks'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="projects/:id/edit" element={<EditProject />} />
            <Route path="my-projects" element={<MyProjects />} />
            <Route path="team/:projectId" element={<Team />} />
            <Route path="tasks/:projectId" element={<Tasks />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App