export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  
  const completedTasks = tasks.filter(task => task.status === 'Completed').length
  return Math.round((completedTasks / tasks.length) * 100)
}

export const getTaskCompletionRate = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  
  const completedTasks = tasks.filter(task => task.status === 'Completed').length
  return {
    completed: completedTasks,
    total: tasks.length,
    percentage: Math.round((completedTasks / tasks.length) * 100)
  }
}

export const getProjectHealth = (project) => {
  if (!project) return { status: 'Unknown', color: 'gray' }
  
  const today = new Date()
  const deadline = new Date(project.deadline)
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  
  if (project.progress === 100) {
    return { status: 'Completed', color: 'green' }
  } else if (daysLeft < 0) {
    return { status: 'Overdue', color: 'red' }
  } else if (daysLeft <= 7 && project.progress < 50) {
    return { status: 'Critical', color: 'red' }
  } else if (daysLeft <= 14) {
    return { status: 'Warning', color: 'yellow' }
  } else {
    return { status: 'On Track', color: 'blue' }
  }
}