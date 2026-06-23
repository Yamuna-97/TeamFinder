const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getMyProjects,
  applyToProject,
  getJoinRequests,
  handleJoinRequest,
  searchProjects
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/search', searchProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, createProject);
router.get('/my/projects', protect, getMyProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/apply', protect, applyToProject);
router.get('/:id/requests', protect, getJoinRequests);
router.put('/:projectId/requests/:requestId', protect, handleJoinRequest);

module.exports = router;