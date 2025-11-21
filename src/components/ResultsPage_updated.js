import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getWellnessRecommendations } from '../data/assessmentData_complete';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth(); // eslint-disable-line no-unused-vars

  const assessment = location.state?.assessment;

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Assessment Data</h2>
          <p className="text-gray-600">Please complete an assessment first.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const wellnessData = getWellnessRecommendations(assessment.wellnessIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-100 to-yellow-100 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Assessment Results</h1>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{assessment.categoryName}</h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`text-3xl font-bold ${wellnessData.color}`}>
                Overall Wellness: {assessment.wellnessIndex}/100
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${wellnessData.color} bg-white border-2`}>
                {wellnessData.level}
              </div>
            </div>
            <p className="text-gray-700 text-center max-w-2xl mx-auto">
              {wellnessData.message}
            </p>
          </div>
        </motion.div>

        {/* Individual Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {assessment.testResults.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{test.testName}</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Score: {test.score}/{test.maxScore}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${test.color} bg-gray-50`}>
                  {test.severity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${test.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(test.score / test.maxScore) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-indigo-600 text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-x-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            📊 View My Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Take Another Assessment
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            💬 AI Support Chat
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Assessment completed on {new Date(assessment.date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Remember: This assessment is for informational purposes only and does not replace professional medical advice.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;
