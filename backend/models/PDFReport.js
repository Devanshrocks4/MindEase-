const mongoose = require('mongoose');

const pdfReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: [true, 'Assessment ID is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  pdfPath: {
    type: String,
    required: [true, 'PDF path is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastDownloadedAt: Date,
  metadata: {
    generator: {
      type: String,
      default: 'pdfkit'
    },
    version: String,
    includesCharts: {
      type: Boolean,
      default: false
    },
    pageCount: {
      type: Number,
      min: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
pdfReportSchema.index({ userId: 1, generatedAt: -1 });
pdfReportSchema.index({ assessmentId: 1 });
pdfReportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Pre-save middleware to set expiration
pdfReportSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
  }
  next();
});

module.exports = mongoose.model('PDFReport', pdfReportSchema);
