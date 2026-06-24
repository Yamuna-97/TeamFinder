import React, { useState, useEffect } from 'react'
import studentService from '../services/studentService'

const FindTeammates = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFiltersPanel, setShowFiltersPanel] = useState(true)
  const [sortBy, setSortBy] = useState('Relevance')
  const [filters, setFilters] = useState({
    skill: '',
    role: '',
    experience: '',
    availabilityStatus: '',
    location: ''
  })

  // List of roles, experience levels, etc. matching typical options
  const roles = [
    'Full Stack Developer',
    'UI/UX Designer',
    'Machine Learning Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile Developer'
  ]

  const experiences = [
    '1+ Year',
    '2+ Years',
    '3+ Years',
    '4+ Years'
  ]

  const availabilities = [
    'Available',
    'Busy',
    'In a Project'
  ]

  const locations = [
    'Hyderabad, India',
    'Bangalore, India',
    'Pune, India',
    'Chennai, India',
    'Mumbai, India'
  ]

  useEffect(() => {
    fetchTeammates()
  }, [filters, searchQuery, sortBy])

  const fetchTeammates = async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (filters.skill) params.skill = filters.skill
      if (filters.role) params.role = filters.role
      if (filters.experience) params.experience = filters.experience
      if (filters.availabilityStatus) params.availabilityStatus = filters.availabilityStatus
      if (filters.location) params.location = filters.location
      
      const response = await studentService.getStudents(params)
      let data = response.data || []
      
      // Filter out Yamuna (the current logged in user) so they don't see themselves as teammate
      data = data.filter(student => student.name.toUpperCase() !== 'YAMUNA')

      // Sorting
      if (sortBy === 'Relevance') {
        // Default API order
      } else if (sortBy === 'Name') {
        data.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === 'Experience') {
        data.sort((a, b) => b.experience.localeCompare(a.experience))
      }

      setStudents(data)
    } catch (error) {
      console.error('Error fetching teammates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({
      skill: '',
      role: '',
      experience: '',
      availabilityStatus: '',
      location: ''
    })
    setSearchQuery('')
  }

  const getAvatar = (name) => {
    if (name.includes('Arjun')) {
      return (
        <div className="relative flex-shrink-0">
          <svg className="w-16 h-16 rounded-full shadow-sm" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="#eff6ff" />
            <circle cx="50" cy="45" r="22" fill="#fed7aa" />
            <path d="M30 40c0-15 10-22 20-22s20 7 20 22c0 2-4-2-10-2s-10 4-10 4-4-4-10-4-10 0-10 2z" fill="#1e293b" />
            <rect x="36" y="42" width="10" height="8" rx="2" fill="none" stroke="#1e293b" strokeWidth="2" />
            <rect x="54" y="42" width="10" height="8" rx="2" fill="none" stroke="#1e293b" strokeWidth="2" />
            <line x1="46" y1="46" x2="54" y2="46" stroke="#1e293b" strokeWidth="2" />
            <circle cx="41" cy="46" r="1.5" fill="#1e293b" />
            <circle cx="59" cy="46" r="1.5" fill="#1e293b" />
            <path d="M46 56q4 3 8 0" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <path d="M25 80c0-12 10-18 25-18s25 6 25 18v20H25V80z" fill="#2563eb" />
          </svg>
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-[#10b981]" />
        </div>
      )
    }
    if (name.includes('Sneha')) {
      return (
        <div className="relative flex-shrink-0">
          <svg className="w-16 h-16 rounded-full shadow-sm" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="#fdf2f8" />
            <path d="M25 50c0 20 5 30 25 30s25-10 25-30V35C75 20 65 15 50 15S25 20 25 35v15z" fill="#78350f" />
            <circle cx="50" cy="48" r="21" fill="#ffedd5" />
            <path d="M29 35c5-10 12-8 21-8s16-2 21 8c2 4 1 8 1 8s-4-6-10-6-8 4-8 4-5-4-11-4-10 6-10 6 1 0 5-8z" fill="#78350f" />
            <circle cx="43" cy="46" r="2.5" fill="#1e293b" />
            <circle cx="57" cy="46" r="2.5" fill="#1e293b" />
            <path d="M45 57q5 4 10 0" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
            <path d="M25 82c0-12 10-18 25-18s25 6 25 18v18H25V82z" fill="#ec4899" />
          </svg>
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-[#10b981]" />
        </div>
      )
    }
    if (name.includes('Vikram')) {
      return (
        <div className="relative flex-shrink-0">
          <svg className="w-16 h-16 rounded-full shadow-sm" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="#f7fee7" />
            <circle cx="50" cy="46" r="22" fill="#ffedd5" />
            <path d="M28 40c0-15 10-22 22-22s22 7 22 22c0 3-3-2-9-2s-9 4-9 4-4-4-9-4-9 0-9 2z" fill="#1e293b" />
            <circle cx="42" cy="46" r="2" fill="#1e293b" />
            <circle cx="58" cy="46" r="2" fill="#1e293b" />
            <path d="M45 56q5 4 10 0" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <path d="M25 80c0-12 10-18 25-18s25 6 25 18v20H25V80z" fill="#0d9488" />
          </svg>
          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-[#10b981]" />
        </div>
      )
    }
    // Default avatar
    return (
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm border border-blue-200">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-[#10b981]" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Find Teammates</h1>
        <p className="text-sm text-gray-500 mt-1">Discover and connect with talented developers</p>
      </div>

      {/* Search and Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skills, role..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm text-gray-700 placeholder-gray-400 shadow-sm"
          />
        </div>

        {/* Filters Panel Toggle */}
        <button
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-xl font-medium text-sm transition shadow-sm ${
            showFiltersPanel
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl pl-5 pr-10 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
          >
            <option value="Relevance">Sort by: Relevance</option>
            <option value="Experience">Sort by: Experience</option>
            <option value="Name">Sort by: Name</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters Sidebar Column */}
        {showFiltersPanel && (
          <div className="lg:col-span-1 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">Filters</h3>
            </div>
            
            <div className="space-y-4">
              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Skills</label>
                <input
                  type="text"
                  name="skill"
                  value={filters.skill}
                  onChange={handleFilterChange}
                  placeholder="e.g., React, Python, MongoDB"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Select role</option>
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Experience Level</label>
                <select
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Select level</option>
                  {experiences.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Availability</label>
                <select
                  name="availabilityStatus"
                  value={filters.availabilityStatus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Select availability</option>
                  {availabilities.map(av => (
                    <option key={av} value={av}>{av}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="">Select location</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="w-full mt-2 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Teammate Cards List Column */}
        <div className={`grid grid-cols-1 gap-5 ${showFiltersPanel ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white border border-gray-150 rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl text-center p-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-800">No teammates found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">We couldn't find any developers matching your filter criteria. Try adjusting them.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            students.map((student) => (
              <div key={student._id} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col md:flex-row gap-5 items-start">
                
                {/* Bookmark Button in Top-Right */}
                <button className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>

                {/* Avatar and Online Indicator */}
                {getAvatar(student.name)}

                {/* Profile Details */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">{student.name}</h3>
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      student.availabilityStatus === 'Available'
                        ? student.role?.includes('Designer')
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}>
                      {student.availabilityStatus}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 font-medium mt-1">{student.role || 'Software Engineer'}</p>
                  
                  {/* Meta: Experience & Location */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400 font-semibold">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{student.experience || '1+ Year'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{student.location || 'India'}</span>
                    </div>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {student.skills && student.skills.map((skillObj, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#eff6ff] text-[#2563eb]">
                        {skillObj.skillName}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mt-3.5 leading-relaxed">{student.bio}</p>
                </div>

                {/* Right actions: socials and buttons */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 flex-shrink-0">
                  {/* Social links row */}
                  <div className="flex items-center gap-3">
                    {student.githubLink && (
                      <a href={student.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                    )}
                    {student.linkedinLink && (
                      <a href={student.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {student.portfolioLink && (
                      <a href={student.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none justify-center bg-[#2563eb] text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm">
                      Connect
                    </button>
                    <button className="flex-1 md:flex-none justify-center bg-white border border-gray-200 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold text-sm text-gray-700 transition shadow-sm">
                      View Profile
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Promo Banner */}
      <div className="bg-gradient-to-r from-[#eff6ff] to-[#f5f9ff] border border-[#dbeafe] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between mt-8 gap-4 shadow-sm">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-base">Create a Team Room</h4>
            <p className="text-sm text-gray-500 mt-0.5">Found someone interesting? Start a team room and collaborate in real-time.</p>
          </div>
        </div>
        <button className="bg-white border border-gray-200 shadow-sm hover:shadow-md px-6 py-2.5 rounded-xl font-bold text-sm text-gray-800 flex items-center gap-2 transition duration-200">
          <span>Create Team Room</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FindTeammates
