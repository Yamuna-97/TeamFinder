const Student = require('../models/Student');
const StudentSkill = require('../models/StudentSkill');
const { AppError } = require('../middleware/errorMiddleware');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res, next) => {
  try {
    const { department, year, skill } = req.query;
    
    let query = {};
    
    // Filter by department
    if (department) {
      query.department = department;
    }
    
    // Filter by year
    if (year) {
      query.year = parseInt(year);
    }

    let students = await Student.find(query).select('-password');

    // Filter by skill if provided
    if (skill) {
      const studentSkills = await StudentSkill.find({ 
        skillName: { $regex: skill, $options: 'i' } 
      }).distinct('student');
      
      students = students.filter(student => 
        studentSkills.some(s => s.toString() === student._id.toString())
      );
    }

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get student skills
    const skills = await StudentSkill.find({ student: student._id });

    res.json({
      success: true,
      data: {
        ...student.toObject(),
        skills
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student skills
// @route   GET /api/students/skills
// @access  Private
const getMySkills = async (req, res, next) => {
  try {
    const skills = await StudentSkill.find({ student: req.user._id });

    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add student skill
// @route   POST /api/students/skills
// @access  Private
const addSkill = async (req, res, next) => {
  try {
    const { skillName, skillLevel } = req.body;

    // Check if skill already exists for student
    const existingSkill = await StudentSkill.findOne({
      student: req.user._id,
      skillName: { $regex: new RegExp(`^${skillName}$`, 'i') }
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists in your profile'
      });
    }

    const skill = await StudentSkill.create({
      student: req.user._id,
      skillName,
      skillLevel: skillLevel || 'Beginner'
    });

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student skill
// @route   PUT /api/students/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const { skillLevel } = req.body;

    const skill = await StudentSkill.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    skill.skillLevel = skillLevel || skill.skillLevel;
    await skill.save();

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student skill
// @route   DELETE /api/students/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await StudentSkill.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      message: 'Skill removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill
};