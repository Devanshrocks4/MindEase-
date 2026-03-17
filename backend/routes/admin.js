const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const UserDashboard = require('../models/UserDashboard');
const PDFReport = require('../models/PDFReport');
const { generateUserReportPDF } = require('../utils/pdfGenerator');

const router = express.Router();

// Apply authentication and admin middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// @route   GET /api/admin/users
// @desc    Get all users with optional filtering
// @access  Admin only
router.get('/users', async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;

    let query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Status filter
    if (status) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('name email role lastLogin createdAt isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   GET /api/admin/user/:id/assessments
// @desc    Get user's assessments
// @access  Admin only
router.get('/user/:id/assessments', async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.params.id })
      .sort({ testDate: -1 });

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user assessments'
    });
  }
});

// @route   GET /api/admin/assessments
// @desc    Get all assessments with filters
// @access  Admin only
router.get('/assessments', async (req, res) => {
  try {
    const { startDate, endDate, category, userId } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.testDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (userId) {
      query.userId = userId;
    }

    const assessments = await Assessment.find(query)
      .populate('userId', 'name email')
      .sort({ testDate: -1 })
      .limit(1000); // Limit for performance

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessments'
    });
  }
});

// @route   GET /api/admin/export/pdf
// @desc    Export user data as PDF
// @access  Admin only
router.get('/export/pdf', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const assessments = await Assessment.find({ userId })
      .sort({ testDate: -1 });

    const pdfPath = await generateUserReportPDF(user, assessments);

    const fileName = `user_${userId}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    res.download(pdfPath, fileName);
  } catch (error) {
    console.error('Error generating user PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report'
    });
  }
});

// @route   GET /api/admin/export/csv
// @desc    Export assessment data as CSV
// @access  Admin only
router.get('/export/csv', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.testDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const assessments = await Assessment.find(query)
      .populate('userId', 'name email')
      .sort({ testDate: -1 });

    // Generate CSV content
    let csvContent = 'User Name,User Email,Category,Category Name,Test Date,Wellness Index,Wellness Level,Computed Score\n';

    assessments.forEach(assessment => {
      const row = [
        assessment.userId.name,
        assessment.userId.email,
        assessment.category,
        assessment.categoryName,
        new Date(assessment.testDate).toISOString().split('T')[0],
        assessment.wellnessIndex,
        assessment.wellnessLevel,
        assessment.computedScore
      ];
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const fileName = `assessments_export_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating CSV export'
    });
  }
});

// @route   GET /api/admin/online-users
// @desc    Get online users
// @access  Admin only
router.get('/online-users', async (req, res) => {
  try {
    const onlineUsers = await User.find({ isOnline: true, isActive: true })
      .select('name email lastLogin')
      .sort({ lastLogin: -1 });

    res.json({
      success: true,
      data: onlineUsers
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching online users'
    });
  }
});

// @route   GET /api/admin/recent-users
// @desc    Get recent registered users
// @access  Admin only
router.get('/recent-users', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.find({
      createdAt: { $gte: sevenDaysAgo },
      isActive: true
    })
      .select('name email createdAt lastLogin')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recentUsers
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent users'
    });
  }
});

// @route   GET /api/admin/recent-logins
// @desc    Get recent user logins
// @access  Admin only
router.get('/recent-logins', async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentLogins = await User.find({
      lastLogin: { $gte: oneDayAgo },
      isActive: true
    })
      .select('name email lastLogin')
      .sort({ lastLogin: -1 });

    res.json({
      success: true,
      data: recentLogins
    });
  } catch (error) {
    console.error('Error fetching recent logins:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent logins'
    });
  }
});

// @route   GET /api/admin/recent-assessments
// @desc    Get recent assessments
// @access  Admin only
router.get('/recent-assessments', async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const recentAssessments = await Assessment.find({
      testDate: { $gte: oneDayAgo }
    })
      .populate('userId', 'name email')
      .sort({ testDate: -1 });

    res.json({
      success: true,
      data: recentAssessments,
      count: recentAssessments.length
    });
  } catch (error) {
    console.error('Error fetching recent assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent assessments'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get admin analytics data
// @access  Admin only
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalAssessments = await Assessment.countDocuments();
    const onlineUsers = await User.countDocuments({ isOnline: true, isActive: true });

    // Get assessments with user data
    const assessments = await Assessment.find()
      .populate('userId', 'name email')
      .sort({ testDate: -1 })
      .limit(100);

    // Calculate analytics
    const issueBreakdown = {};
    const riskLevelBreakdown = { Low: 0, Moderate: 0, High: 0 };
    const userStats = {};

    assessments.forEach(assessment => {
      // Issue breakdown
      const issueKey = assessment.categoryName || assessment.category;
      issueBreakdown[issueKey] = (issueBreakdown[issueKey] || 0) + 1;

      // Risk level breakdown based on wellness index
      const wellnessIndex = assessment.wellnessIndex || 0;
      if (wellnessIndex < 33) riskLevelBreakdown.Low++;
      else if (wellnessIndex < 66) riskLevelBreakdown.Moderate++;
      else riskLevelBreakdown.High++;

      // User stats
      const userId = assessment.userId._id.toString();
      if (!userStats[userId]) {
        userStats[userId] = {
          userId,
          name: assessment.userId.name,
          email: assessment.userId.email,
          totalAssessments: 0,
          averageScore: 0,
          lastAssessment: null
        };
      }
      userStats[userId].totalAssessments++;
      if (!userStats[userId].lastAssessment || new Date(assessment.testDate) > new Date(userStats[userId].lastAssessment)) {
        userStats[userId].lastAssessment = assessment.testDate;
      }
    });

    // Calculate averages
    Object.values(userStats).forEach(user => {
      const userAssessments = assessments.filter(a => a.userId._id.toString() === user.userId);
      const scores = userAssessments.map(a => a.wellnessIndex || 0);
      user.averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    });

    const analytics = {
      totalUsers,
      onlineUsers,
      totalAssessments,
      averageRiskScore: assessments.length > 0 ?
        Math.round(assessments.reduce((sum, a) => sum + (a.wellnessIndex || 0), 0) / assessments.length) : 0,
      issueBreakdown,
      riskLevelBreakdown,
      recentAssessments: assessments.slice(0, 10),
      userStats: Object.values(userStats)
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

// @route   POST /api/admin/user
// @desc    Create a new user
// @access  Admin only
router.post('/user', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'user',
      isActive: true
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
});

// @route   DELETE /api/admin/user/:id
// @desc    Delete a user and all their assessments
// @access  Admin only
router.delete('/user/:id', async (req, res) => {
  try {
    // First delete all assessments for this user
    await Assessment.deleteMany({ userId: req.params.id });

    // Then delete the user
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

module.exports = router;
