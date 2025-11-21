const mongoose = require('mongoose');

const userDashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  recentActivities: [{
    type: {
      type: String,
      enum: ['assessment_completed', 'pdf_downloaded', 'login']
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  summaryData: {
    totalAssessments: {
      type: Number,
      default: 0
    },
    averageWellnessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAssessmentDate: Date,
    categoriesCompleted: [{
      category: String,
      count: Number,
      lastCompleted: Date
    }],
    wellnessTrend: [{
      date: Date,
      score: Number
    }],
    improvementAreas: [{
      category: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      description: String
    }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the lastUpdated field before saving
userDashboardSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('UserDashboard', userDashboardSchema);
