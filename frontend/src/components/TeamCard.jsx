import React from 'react'

const TeamCard = ({ member, isOwner, isCurrentUser, onRemove }) => {
  const student = member.student || member

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
          {student.name?.charAt(0).toUpperCase()}
        </div>

        {/* Member Info */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {student.name}
        </h3>
        
        {student.department && (
          <p className="text-sm text-gray-600 mb-1">{student.department}</p>
        )}
        
        {student.year && (
          <p className="text-sm text-gray-500 mb-2">Year {student.year}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {isOwner && (
            <span className="badge badge-blue">Team Leader</span>
          )}
          {isCurrentUser && (
            <span className="badge badge-green">You</span>
          )}
        </div>

        {/* Contact Info */}
        {student.email && (
          <div className="w-full text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{student.email}</span>
            </div>
            {student.registerNumber && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span>{student.registerNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {isOwner && !isCurrentUser && onRemove && (
          <button
            onClick={() => onRemove(member._id)}
            className="btn-danger btn-sm mt-4"
          >
            Remove Member
          </button>
        )}
      </div>
    </div>
  )
}

export default TeamCard