import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import projectService from '../services/projectService'

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Machine Learning',
  'Data Science',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain',
  'IoT',
  'Game Development',
  'DevOps',
  'Open Source',
  'Other',
]

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const MEETING_MODES = ['Online', 'Offline', 'Hybrid']

const CreateProject = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)
  const [error, setError] = useState('')
  const skillInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    description: '',
    projectLevel: '',
    teamSize: 3,
    githubRepo: '',
    recruitmentDeadline: '',
    deadline: '',
    meetingMode: 'Online',
    location: '',
    minimumYear: 1,
    maximumYear: 5,
    mentorName: '',
    mentorEmail: '',
    visibility: 'public',
  })

  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSkill = () => {
    const val = skillInput.trim()
    if (val && !skills.includes(val)) {
      setSkills([...skills, val])
    }
    setSkillInput('')
    skillInputRef.current?.focus()
  }

  const removeSkill = idx => {
    setSkills(skills.filter((_, i) => i !== idx))
  }

  const handleSkillKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const changeTeamSize = delta => {
    setFormData(prev => ({
      ...prev,
      teamSize: Math.max(1, Math.min(20, prev.teamSize + delta))
    }))
  }

  const buildPayload = () => ({
    ...formData,
    teamSize: Number(formData.teamSize),
    minimumYear: Number(formData.minimumYear),
    maximumYear: Number(formData.maximumYear),
    skills: skills.map(s => ({ skillName: s, requiredLevel: 'Beginner' })),
  })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await projectService.createProject(buildPayload())
      navigate('/my-projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleDraft = async () => {
    setDraftLoading(true)
    setError('')
    try {
      await projectService.createProject({ ...buildPayload(), status: 'On Hold' })
      navigate('/my-projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save draft')
    } finally {
      setDraftLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Project</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to create your project</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ===== LEFT COLUMN ===== */}
          <div className="flex flex-col gap-5">

            {/* Project Title */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter project title"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Category */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer pr-10"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe your project, its purpose and goals..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Required Skills */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  ref={skillInputRef}
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add skills (e.g. React, Node.js, Python)"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 mb-2">Press Enter after each skill</p>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(i)}
                        className="text-blue-400 hover:text-red-500 transition ml-0.5 text-base leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting Mode */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Mode</label>
              <div className="flex gap-3">
                {MEETING_MODES.map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="meetingMode"
                      value={m}
                      checked={formData.meetingMode === m}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700 font-medium">{m}</span>
                  </label>
                ))}
              </div>
              {formData.meetingMode !== 'Online' && (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Meeting location"
                  className="mt-3 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="flex flex-col gap-5">

            {/* Team Size stepper */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Team Size <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeTeamSize(-1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg font-bold"
                >
                  −
                </button>
                <span className="text-2xl font-extrabold text-gray-900 w-8 text-center">
                  {formData.teamSize}
                </span>
                <button
                  type="button"
                  onClick={() => changeTeamSize(1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="projectLevel"
                  value={formData.projectLevel}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer pr-10"
                >
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* GitHub Repository */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                GitHub Repository <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                name="githubRepo"
                value={formData.githubRepo}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Recruitment Deadline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Recruitment Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="recruitmentDeadline"
                value={formData.recruitmentDeadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Project Deadline */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Project Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Visibility */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Visibility <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  formData.visibility === 'public'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={handleChange}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Public</p>
                    <p className="text-xs text-gray-500 mt-0.5">Anyone can view and join</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  formData.visibility === 'private'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={handleChange}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">Private</p>
                    <p className="text-xs text-gray-500 mt-0.5">Only invited people can view</p>
                  </div>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-7 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDraft}
            disabled={draftLoading}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          >
            {draftLoading ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProject