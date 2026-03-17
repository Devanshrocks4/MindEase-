const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireOwnershipOrAdmin } = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const UserDashboard = require('../models/UserDashboard');
const PDFReport = require('../models/PDFReport');
const { generateAssessmentPDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs-extra');

module.exports = (io) => {
  const router = express.Router();

// Apply authentication to all user routes
router.use(authenticateToken);

// @route   GET /api/user/assessments
// @desc    Get user's assessment history
// @access  Private
router.get('/assessments', async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id })
      .sort({ testDate: -1 })
      .select('-__v');

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

// @route   GET /api/user/assessment/:id
// @desc    Get specific assessment
// @access  Private
router.get('/assessment/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment'
    });
  }
});

// @route   POST /api/user/assessment/create
// @desc    Create new assessment
// @access  Private
router.post('/assessment/create', [
  body('category').notEmpty().withMessage('Category is required'),
  body('categoryName').notEmpty().withMessage('Category name is required'),
  body('testDate').isISO8601().withMessage('Valid test date is required'),
  body('rawScores').isArray().withMessage('Raw scores must be an array'),
  body('computedScore').isNumeric().withMessage('Computed score must be numeric'),
  body('resultCategory').notEmpty().withMessage('Result category is required'),
  body('wellnessIndex').isNumeric().withMessage('Wellness index must be numeric'),
  body('wellnessLevel').notEmpty().withMessage('Wellness level is required'),
  body('testResults').isArray().withMessage('Test results must be an array'),
  body('suggestions').isArray().withMessage('Suggestions must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const assessmentData = {
      ...req.body,
      userId: req.user._id
    };

    const assessment = new Assessment(assessmentData);
    await assessment.save();

    // Emit to admin
    io.to('admin').emit('newAssessment', {
      userId: req.user._id,
      category: assessment.category,
      score: assessment.wellnessIndex,
      date: assessment.testDate
    });

    // Update user dashboard
    await updateUserDashboard(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: assessment
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating assessment'
    });
  }
});

// @route   GET /api/user/assessment/:id/pdf
// @desc    Download PDF report for assessment
// @access  Private
router.get('/assessment/:id/pdf', async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if PDF already exists
    let pdfReport = await PDFReport.findOne({
      assessmentId: req.params.id,
      userId: req.user._id,
      isActive: true
    });

    if (!pdfReport) {
      // Generate new PDF
      const pdfPath = await generateAssessmentPDF(assessment);

      pdfReport = new PDFReport({
        userId: req.user._id,
        assessmentId: req.params.id,
        fileName: `MindEase_Report_${assessment.category}_${new Date().toISOString().split('T')[0]}.pdf`,
        pdfPath,
        fileSize: fs.statSync(pdfPath).size,
        metadata: {
          pageCount: 2, // Basic estimate
          includesCharts: false
        }
      });

      await pdfReport.save();
    }

    // Update download count
    pdfReport.downloadCount += 1;
    pdfReport.lastDownloadedAt = new Date();
    await pdfReport.save();

    // Send file
    res.download(pdfReport.pdfPath, pdfReport.fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report'
    });
  }
});

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const dashboard = await UserDashboard.findOne({ userId: req.user._id });

    if (!dashboard) {
      // Create default dashboard if not exists
      const newDashboard = new UserDashboard({
        userId: req.user._id,
        summaryData: {
          totalAssessments: 0,
          averageWellnessScore: 0
        }
      });
      await newDashboard.save();

      return res.json({
        success: true,
        data: newDashboard
      });
    }

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// Helper function to update user dashboard
async function updateUserDashboard(userId) {
  try {
    const assessments = await Assessment.find({ userId }).sort({ testDate: -1 });

    if (assessments.length === 0) return;

    const totalAssessments = assessments.length;
    const averageWellnessScore = assessments.reduce((sum, a) => sum + a.wellnessIndex, 0) / totalAssessments;

    // Get categories
    const categories = {};
    assessments.forEach(assessment => {
      categories[assessment.category] = (categories[assessment.category] || 0) + 1;
    });

    const categoriesCompleted = Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      lastCompleted: assessments.find(a => a.category === category)?.testDate
    }));

    // Get wellness trend (last 10 assessments)
    const wellnessTrend = assessments.slice(0, 10).map(a => ({
      date: a.testDate,
      score: a.wellnessIndex
    }));

    const dashboardData = {
      summaryData: {
        totalAssessments,
        averageWellnessScore: Math.round(averageWellnessScore),
        lastAssessmentDate: assessments[0].testDate,
        categoriesCompleted,
        wellnessTrend
      }
    };

    await UserDashboard.findOneAndUpdate(
      { userId },
      dashboardData,
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating dashboard:', error);
  }
}

  return router;
};
