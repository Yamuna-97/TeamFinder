const express = require('express');
const {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.get('/my-tasks', protect, getMyTasks);
router.get('/project/:projectId', protect, getProjectTasks);
router.get('/stats/:projectId', protect, getTaskStats);
router.post('/project/:projectId', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;