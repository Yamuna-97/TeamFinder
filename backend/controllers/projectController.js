const Project = require('../models/Project');
const ProjectSkill = require('../models/ProjectSkill');
const JoinRequest = require('../models/JoinRequest');
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const Student = require('../models/Student');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.user._id,
      currentMembers: 1
    };

    const project = await Project.create(projectData);

    // Add project skills if provided
    if (req.body.skills && req.body.skills.length > 0) {
      const projectSkills = req.body.skills.map(skill => ({
        project: project._id,
        skillName: skill.skillName,
        requiredLevel: skill.requiredLevel || 'Beginner'
      }));
      await ProjectSkill.insertMany(projectSkills);
    }

    // Create team automatically
    await Team.create({
      project: project._id,
      leader: req.user._id
    });

    // Add owner as team member
    const team = await Team.findOne({ project: project._id });
    await TeamMember.create({
      team: team._id,
      student: req.user._id
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const { 
      domain, 
      projectType, 
      status, 
      search,
      minimumYear,
      maximumYear,
      sort 
    } = req.query;

    let query = { isPublic: true };

    // Filter by domain
    if (domain) {
      query.domain = domain;
    }

    // Filter by project type
    if (projectType) {
      query.projectType = projectType;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by year eligibility
    if (minimumYear) {
      query.minimumYear = { $gte: parseInt(minimumYear) };
    }
    if (maximumYear) {
      query.maximumYear = { $lte: parseInt(maximumYear) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'deadline') sortOption = { recruitmentDeadline: 1 };

    const projects = await Project.find(query)
      .populate('owner', 'name email department year')
      .sort(sortOption);

    // Get skills and tags for each project
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const skills = await ProjectSkill.find({ project: project._id });
        return {
          ...project.toObject(),
          skills
        };
      })
    );

    res.json({
      success: true,
      count: projectsWithDetails.length,
      data: projectsWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email department year profilePicture');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const skills = await ProjectSkill.find({ project: project._id });
    const team = await Team.findOne({ project: project._id });
    const teamMembers = team ? await TeamMember.find({ team: team._id })
      .populate('student', 'name email department year') : [];

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        skills,
        team: teamMembers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update skills if provided
    if (req.body.skills) {
      await ProjectSkill.deleteMany({ project: project._id });
      const projectSkills = req.body.skills.map(skill => ({
        project: project._id,
        skillName: skill.skillName,
        requiredLevel: skill.requiredLevel || 'Beginner'
      }));
      await ProjectSkill.insertMany(projectSkills);
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Delete related data
    await ProjectSkill.deleteMany({ project: project._id });
    await JoinRequest.deleteMany({ project: project._id });
    
    const team = await Team.findOne({ project: project._id });
    if (team) {
      await TeamMember.deleteMany({ team: team._id });
      await Team.deleteOne({ _id: team._id });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my projects
// @route   GET /api/projects/my/projects
// @access  Private
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('owner', 'name email');

    // Get skills for each project
    const projectsWithSkills = await Promise.all(
      projects.map(async (project) => {
        const skills = await ProjectSkill.find({ project: project._id });
        return {
          ...project.toObject(),
          skills
        };
      })
    );

    res.json({
      success: true,
      count: projectsWithSkills.length,
      data: projectsWithSkills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to join project
// @route   POST /api/projects/:id/apply
// @access  Private
const applyToProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project is still recruiting
    if (project.status !== 'Recruiting') {
      return res.status(400).json({
        success: false,
        message: 'Project is no longer recruiting'
      });
    }

    // Check if project has reached team size
    if (project.currentMembers >= project.teamSize) {
      return res.status(400).json({
        success: false,
        message: 'Team is already full'
      });
    }

    // Check year eligibility
    const student = await Student.findById(req.user._id);
    if (student.year < project.minimumYear || student.year > project.maximumYear) {
      return res.status(400).json({
        success: false,
        message: `This project requires students from year ${project.minimumYear} to ${project.maximumYear}`
      });
    }

    // Check if recruitment deadline has passed
    if (new Date(project.recruitmentDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Recruitment deadline has passed'
      });
    }

    // Check if already applied
    const existingRequest = await JoinRequest.findOne({
      project: project._id,
      student: req.user._id
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this project'
      });
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
      project: project._id,
      student: req.user._id,
      message: req.body.message || ''
    });

    res.status(201).json({
      success: true,
      data: joinRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get join requests for project
// @route   GET /api/projects/:id/requests
// @access  Private (Owner only)
const getJoinRequests = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view requests'
      });
    }

    const requests = await JoinRequest.find({ project: project._id })
      .populate('student', 'name email department year registerNumber');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept/Reject join request
// @route   PUT /api/projects/:projectId/requests/:requestId
// @access  Private (Owner only)
const handleJoinRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is project owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to handle requests'
      });
    }

    const request = await JoinRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found'
      });
    }

    request.status = status;
    await request.save();

    // If accepted, add to team
    if (status === 'Accepted') {
      const team = await Team.findOne({ project: project._id });
      
      if (team) {
        // Check if already a member
        const existingMember = await TeamMember.findOne({
          team: team._id,
          student: request.student
        });

        if (!existingMember) {
          await TeamMember.create({
            team: team._id,
            student: request.student
          });

          // Update project current members
          project.currentMembers += 1;
          await project.save();
        }
      }
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search projects
// @route   GET /api/projects/search
// @access  Public
const searchProjects = async (req, res, next) => {
  try {
    const { q, skill, domain, projectType } = req.query;

    let query = { isPublic: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (skill) {
      const projectSkills = await ProjectSkill.find({
        skillName: { $regex: skill, $options: 'i' }
      }).distinct('project');
      
      query._id = { $in: projectSkills };
    }

    if (domain) query.domain = domain;
    if (projectType) query.projectType = projectType;

    const projects = await Project.find(query)
      .populate('owner', 'name email department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};