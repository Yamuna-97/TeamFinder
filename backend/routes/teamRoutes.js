const express = require('express');
const {
  getTeamByProject,
  addTeamMember,
  removeTeamMember,
  getMyTeams
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.get('/my-teams', protect, getMyTeams);
router.get('/project/:projectId', protect, getTeamByProject);
router.post('/:teamId/members', protect, addTeamMember);
router.delete('/:teamId/members/:memberId', protect, removeTeamMember);

module.exports = router;