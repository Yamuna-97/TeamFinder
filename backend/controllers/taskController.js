const Task = require('../models/Task');
const Project = require('../models/Project');
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private (Team members only)
const getProjectTasks = async (req, res, next) => {
  try {
    // Check if user is team member
    const team = await Team.findOne({ project: req.params.projectId });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const isMember = await TeamMember.findOne({
      team: team._id,
      student: req.user._id
    });

    if (!isMember && team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not a team member'
      });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks/project/:projectId
// @access  Private (Team leader only)
const createTask = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner/team leader
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can create tasks'
      });
    }

    // Verify that assigned student is team member
    const team = await Team.findOne({ project: project._id });
    if (team) {
      const isTeamMember = await TeamMember.findOne({
        team: team._id,
        student: req.body.assignedTo
      });

      if (!isTeamMember) {
        return res.status(400).json({
          success: false,
          message: 'Assigned student is not a team member'
        });
      }
    }

    const task = await Task.create({
      ...req.body,
      project: project._id
    });

    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (Team leader or assigned member)
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();

    if (!isOwner && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // If not owner, can only update status
    if (!isOwner) {
      const { status } = req.body;
      if (status) {
        task.status = status;
        await task.save();
      }
    } else {
      task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email');
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Team leader only)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is project owner
    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete tasks'
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'title domain')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats/:projectId
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      highPriority: tasks.filter(t => t.priority === 'High').length,
      mediumPriority: tasks.filter(t => t.priority === 'Medium').length,
      lowPriority: tasks.filter(t => t.priority === 'Low').length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getTaskStats
};