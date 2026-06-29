import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import axios from 'axios'

const Notifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setNotifications(Array.isArray(data?.data) ? data.data : [])
      } catch {
        // keep silent; notifications are optional for baseline functionality
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const unreadCount = notifications.filter(n => !n.readAt).length

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      <p className="text-sm text-gray-600 mt-1">{unreadCount} unread</p>

      {loading ? (
        <div className="mt-6 text-gray-600">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="mt-6 text-gray-600">No notifications</div>
      ) : (
        <ul className="mt-6 space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={
                n.readAt ? 'bg-white border rounded p-4 text-gray-700' : 'bg-blue-50 border border-blue-200 rounded p-4 text-gray-800'
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{n.type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.readAt && (
                  <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">New</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications

