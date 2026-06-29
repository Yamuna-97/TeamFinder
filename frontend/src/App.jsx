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
import FindTeammates from './pages/FindTeammates'
import PrivateRoute from './components/PrivateRoute'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="find-teammates" element={<FindTeammates />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
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