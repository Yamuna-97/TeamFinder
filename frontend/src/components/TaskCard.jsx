import React from 'react'
import { formatDate } from '../utils/formatDate'

const TaskCard = ({ task, isOwner, onUpdateStatus, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'badge-yellow'
      case 'In Progress': return 'badge-blue'
      case 'Completed': return 'badge-green'
      default: return 'badge-gray'
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed'

  return (
    <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
      isOverdue ? 'border-red-300' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{task.title}</h4>
            {isOverdue && (
              <span className="badge badge-red text-xs">Overdue</span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span className={`badge ${getPriorityColor(task.priority)}`}>
          {task.priority} Priority
        </span>
        
        {task.assignedTo && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        )}
        
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(task.dueDate)}
        </span>
      </div>

      {/* Status Update Buttons */}
      {task.status !== 'Completed' && (
        <div className="mt-4 flex gap-2">
          {task.status === 'To Do' && (
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(task._id, 'In Progress')}
              className="btn-primary btn-sm"
            >
              Start Progress
            </button>
          )}
          {task.status === 'In Progress' && (
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(task._id, 'Completed')}
              className="btn-success btn-sm"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskCard