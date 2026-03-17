import jsPDF from 'jspdf';

export const generateAssessmentReport = async (assessment) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(75, 0, 130); // Indigo color
  pdf.text('MindEase Assessment Report', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 20;

  // Overall Wellness Summary
  pdf.setFontSize(16);
  pdf.setTextColor(75, 0, 130);
  pdf.text('Overall Wellness Summary', 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Category: ${assessment.categoryName}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Wellness Index: ${assessment.wellnessIndex}/100`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Wellness Level: ${assessment.wellnessLevel}`, 20, yPosition);

  yPosition += 15;

  // Individual Test Results
  pdf.setFontSize(16);
  pdf.setTextColor(75, 0, 130);
  pdf.text('Individual Test Results', 20, yPosition);

  yPosition += 10;

  assessment.testResults.forEach((test, index) => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${test.testName}`, 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(12);
    pdf.text(`Score: ${test.score}/${test.maxScore}`, 30, yPosition);
    yPosition += 6;
    pdf.text(`Severity: ${test.severity}`, 30, yPosition);
    yPosition += 10;
  });

  // Recommendations
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(16);
  pdf.setTextColor(75, 0, 130);
  pdf.text('Recommendations', 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);

  assessment.suggestions.forEach((suggestion, index) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.text(`${index + 1}. ${suggestion}`, 20, yPosition);
    yPosition += 8;
  });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text('This report is for informational purposes only and does not replace professional medical advice.', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text('MindEase AI - Your Mental Wellness Companion', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return pdf;
};

export const downloadPDF = async (assessment) => {
  try {
    const pdf = await generateAssessmentReport(assessment);
    pdf.save(`MindEase_Report_${assessment.category}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
