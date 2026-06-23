const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const Project = require('../models/Project');
const Student = require('../models/Student');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Get team by project ID
// @route   GET /api/teams/project/:projectId
// @access  Private
const getTeamByProject = async (req, res, next) => {
  try {
    const team = await Team.findOne({ project: req.params.projectId })
      .populate('leader', 'name email department year');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found for this project'
      });
    }

    const members = await TeamMember.find({ team: team._id })
      .populate('student', 'name email department year registerNumber');

    res.json({
      success: true,
      data: {
        team,
        members,
        memberCount: members.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add team member
// @route   POST /api/teams/:teamId/members
// @access  Private (Team leader only)
const addTeamMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can add members'
      });
    }

    // Check if student exists
    const student = await Student.findById(req.body.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if already a member
    const existingMember = await TeamMember.findOne({
      team: team._id,
      student: student._id
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Student is already a team member'
      });
    }

    // Check team size
    const project = await Project.findById(team.project);
    const memberCount = await TeamMember.countDocuments({ team: team._id });

    if (memberCount >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Team is already full'
      });
    }

    const member = await TeamMember.create({
      team: team._id,
      student: student._id
    });

    // Update project current members
    project.currentMembers = memberCount + 1;
    await project.save();

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove team member
// @route   DELETE /api/teams/:teamId/members/:memberId
// @access  Private (Team leader only)
const removeTeamMember = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can remove members'
      });
    }

    // Cannot remove team leader
    const member = await TeamMember.findById(req.params.memberId);
    if (member && member.student.toString() === team.leader.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove team leader'
      });
    }

    await TeamMember.findByIdAndDelete(req.params.memberId);

    // Update project current members
    const project = await Project.findById(team.project);
    project.currentMembers = Math.max(1, project.currentMembers - 1);
    await project.save();

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's teams
// @route   GET /api/teams/my-teams
// @access  Private
const getMyTeams = async (req, res, next) => {
  try {
    const teamMembers = await TeamMember.find({ student: req.user._id })
      .populate({
        path: 'team',
        populate: {
          path: 'project',
          select: 'title domain status'
        }
      });

    res.json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamByProject,
  addTeamMember,
  removeTeamMember,
  getMyTeams
};