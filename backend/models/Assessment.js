const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['stress', 'depression', 'confidence', 'emotional', 'decision', 'social', 'sleep', 'behavioral', 'digital']
  },
  categoryName: {
    type: String,
    required: [true, 'Category name is required']
  },
  testDate: {
    type: Date,
    default: Date.now,
    required: [true, 'Test date is required']
  },
  rawScores: [{
    questionId: String,
    score: Number,
    question: String
  }],
  computedScore: {
    type: Number,
    required: [true, 'Computed score is required'],
    min: 0
  },
  resultCategory: {
    type: String,
    required: [true, 'Result category is required'],
    enum: ['low', 'moderate', 'high', 'severe']
  },
  wellnessIndex: {
    type: Number,
    required: [true, 'Wellness index is required'],
    min: 0,
    max: 100
  },
  wellnessLevel: {
    type: String,
    required: [true, 'Wellness level is required'],
    enum: ['Poor', 'Fair', 'Good', 'Excellent']
  },
  testResults: [{
    testName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    },
    severity: {
      type: String,
      enum: ['minimal', 'mild', 'moderate', 'severe'],
      required: true
    },
    interpretation: String
  }],
  suggestions: [{
    type: String,
    required: true
  }],
  metadata: {
    timeTaken: Number, // in minutes
    deviceType: String,
    browserInfo: String,
    ipAddress: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
assessmentSchema.index({ userId: 1, testDate: -1 });
assessmentSchema.index({ category: 1 });
assessmentSchema.index({ testDate: -1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
