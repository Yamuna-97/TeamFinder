import React from 'react'

const SkillCard = ({ skill, onEdit, onDelete, editable = false }) => {
  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', bar: 'bg-yellow-500', width: '33%' }
      case 'Intermediate':
        return { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-500', width: '66%' }
      case 'Advanced':
        return { bg: 'bg-green-100', text: 'text-green-800', bar: 'bg-green-500', width: '100%' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', bar: 'bg-gray-500', width: '0%' }
    }
  }

  const colors = getSkillLevelColor(skill.skillLevel)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{skill.skillName}</h4>
        </div>
        {editable && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(skill)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit skill"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(skill._id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete skill"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={`badge ${colors.bg} ${colors.text}`}>
          {skill.skillLevel}
        </span>
      </div>

      <div className="bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`${colors.bar} h-2 rounded-full transition-all duration-300`}
          style={{ width: colors.width }}
        ></div>
      </div>

      {skill.category && (
        <p className="text-xs text-gray-500 mt-2">
          Category: {skill.category}
        </p>
      )}
    </div>
  )
}

export default SkillCard