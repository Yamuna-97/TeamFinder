export const formatDate = (date) => {
  if (!date) return ''
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  
  return new Date(date).toLocaleDateString('en-US', options)
}

export const formatDateTime = (date) => {
  if (!date) return ''
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return new Date(date).toLocaleDateString('en-US', options)
}

export const timeAgo = (date) => {
  if (!date) return ''
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return Math.floor(seconds) + ' seconds ago'
}