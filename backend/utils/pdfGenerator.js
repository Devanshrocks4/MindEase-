const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
fs.ensureDirSync(uploadsDir);

// Generate PDF for individual assessment
const generateAssessmentPDF = async (assessment) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `assessment_${assessment._id}_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).font('Helvetica-Bold');
      doc.text('MindEase Assessment Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).font('Helvetica');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);

      // Overall Wellness Summary
      doc.fontSize(16).font('Helvetica-Bold');
      doc.text('Overall Wellness Summary');
      doc.moveDown();

      doc.fontSize(12).font('Helvetica');
      doc.text(`Category: ${assessment.categoryName}`);
      doc.text(`Wellness Index: ${assessment.wellnessIndex}/100`);
      doc.text(`Wellness Level: ${assessment.wellnessLevel}`);
      doc.text(`Test Date: ${new Date(assessment.testDate).toLocaleDateString()}`);
      doc.moveDown();

      // Individual Test Results
      if (assessment.testResults && assessment.testResults.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold');
        doc.text('Individual Test Results');
        doc.moveDown();

        assessment.testResults.forEach((test, index) => {
          doc.fontSize(14).font('Helvetica-Bold');
          doc.text(`${index + 1}. ${test.testName}`);
          doc.moveDown(0.5);

          doc.fontSize(12).font('Helvetica');
          doc.text(`Score: ${test.score}/${test.maxScore}`);
          doc.text(`Severity: ${test.severity}`);
          doc.moveDown();
        });
      }

      // Recommendations
      if (assessment.suggestions && assessment.suggestions.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold');
        doc.text('Recommendations');
        doc.moveDown();

        assessment.suggestions.forEach((suggestion, index) => {
          doc.fontSize(12).font('Helvetica');
          doc.text(`${index + 1}. ${suggestion}`);
          doc.moveDown(0.5);
        });
      }

      // Footer
      doc.fontSize(10).font('Helvetica');
      doc.text('This report is for informational purposes only and does not replace professional medical advice.', 50, doc.page.height - 100, {
        width: doc.page.width - 100,
        align: 'center'
      });
      doc.text('MindEase AI - Your Mental Wellness Companion', 50, doc.page.height - 80, {
        width: doc.page.width - 100,
        align: 'center'
      });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Generate comprehensive user report PDF for admin
const generateUserReportPDF = async (user, assessments) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `user_report_${user._id}_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).font('Helvetica-Bold');
      doc.text('MindEase User Assessment Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).font('Helvetica');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown();

      // User Information
      doc.fontSize(16).font('Helvetica-Bold');
      doc.text('User Information');
      doc.moveDown();

      doc.fontSize(12).font('Helvetica');
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Total Assessments: ${assessments.length}`);
      doc.moveDown();

      // Assessment Summary
      if (assessments.length > 0) {
        const avgWellness = assessments.reduce((sum, a) => sum + a.wellnessIndex, 0) / assessments.length;

        doc.fontSize(16).font('Helvetica-Bold');
        doc.text('Assessment Summary');
        doc.moveDown();

        doc.fontSize(12).font('Helvetica');
        doc.text(`Average Wellness Index: ${Math.round(avgWellness)}/100`);
        doc.text(`Date Range: ${new Date(assessments[assessments.length - 1].testDate).toLocaleDateString()} - ${new Date(assessments[0].testDate).toLocaleDateString()}`);
        doc.moveDown();
      }

      // Individual Assessments
      assessments.forEach((assessment, index) => {
        if (doc.y > doc.page.height - 200) {
          doc.addPage();
        }

        doc.fontSize(14).font('Helvetica-Bold');
        doc.text(`Assessment ${index + 1}: ${assessment.categoryName}`);
        doc.moveDown();

        doc.fontSize(12).font('Helvetica');
        doc.text(`Date: ${new Date(assessment.testDate).toLocaleDateString()}`);
        doc.text(`Wellness Index: ${assessment.wellnessIndex}/100`);
        doc.text(`Wellness Level: ${assessment.wellnessLevel}`);
        doc.text(`Computed Score: ${assessment.computedScore}`);
        doc.moveDown();
      });

      // Footer
      doc.fontSize(10).font('Helvetica');
      doc.text('Confidential - Admin Report Only', 50, doc.page.height - 80, {
        width: doc.page.width - 100,
        align: 'center'
      });
      doc.text('MindEase AI - Admin Analytics', 50, doc.page.height - 60, {
        width: doc.page.width - 100,
        align: 'center'
      });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateAssessmentPDF,
  generateUserReportPDF
};
