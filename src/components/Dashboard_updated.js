import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { getWellnessRecommendations } from '../data/assessmentData_complete';

const DashboardUpdated = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    averageWellness: 0,
    latestAssessment: null,
    improvement: 0
  });

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        let assessmentData = [];

        if (isFirebaseConfigured && db) {
          // Load from Firebase
          const q = query(
            collection(db, 'assessments'),
            where('userId', '==', userId),
            orderBy('date', 'desc')
          );
          const querySnapshot = await getDocs(q);
          assessmentData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        // Load from localStorage as backup/fallback
        const localData = JSON.parse(localStorage.getItem(`mindease_history_${userId}`) || '[]');

        // Merge and deduplicate
        const allAssessments = [...assessmentData, ...localData];
        const uniqueAssessments = allAssessments.filter((assessment, index, self) =>
          index === self.findIndex(a => a.date === assessment.date && a.category === assessment.category)
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        setAssessments(uniqueAssessments);
        calculateStats(uniqueAssessments);
      } catch (error) {
        console.error('Error loading assessments:', error);
        // Fallback to localStorage only
        const localData = JSON.parse(localStorage.getItem(`mindease_history_${userId}`) || '[]');
        setAssessments(localData);
        calculateStats(localData);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [userId]);

  const calculateStats = (assessmentList) => {
    if (assessmentList.length === 0) {
      setStats({
        totalAssessments: 0,
        averageWellness: 0,
        latestAssessment: null,
        improvement: 0
      });
      return;
    }

    const totalAssessments = assessmentList.length;
    const wellnessScores = assessmentList.map(a => a.wellnessIndex || 0);
    const averageWellness = Math.round(wellnessScores.reduce((sum, score) => sum + score, 0) / wellnessScores.length);

    // Calculate improvement (compare first and last assessment)
    let improvement = 0;
    if (assessmentList.length >= 2) {
      const firstAssessment = assessmentList[assessmentList.length - 1];
      const lastAssessment = assessmentList[0];
      improvement = (lastAssessment.wellnessIndex || 0) - (firstAssessment.wellnessIndex || 0);
    }

    setStats({
      totalAssessments,
      averageWellness,
      latestAssessment: assessmentList[0],
      improvement
    });
  };

  const getAssessmentIcon = (category) => {
    const icons = {
      stress: '🧠',
      depression: '😔',
      confidence: '💪',
      emotional: '💔',
      decision: '🤔',
      social: '👥',
      sleep: '😴',
      behavioral: '🏃‍♂️',
      digital: '🔥'
    };
    return icons[category] || '📊';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-emerald-100 via-teal-100 to-cyan-100 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Your Mental Wellness Dashboard</h1>
          <p className="text-gray-600">Track your progress and maintain your mental well-being</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.totalAssessments}</div>
            <div className="text-gray-600">Total Assessments</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.averageWellness}</div>
            <div className="text-gray-600">Average Wellness</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className={`text-3xl font-bold mb-2 ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.improvement > 0 ? '+' : ''}{stats.improvement}
            </div>
            <div className="text-gray-600">Wellness Change</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {stats.latestAssessment ? formatDate(stats.latestAssessment.date) : 'No assessments yet'}
            </div>
            <div className="text-gray-600">Last Assessment</div>
          </div>
        </motion.div>

        {/* Recent Assessments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Assessments</h2>

          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assessments Yet</h3>
              <p className="text-gray-600 mb-6">Start your mental wellness journey by taking your first assessment.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Take Your First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.slice(0, 5).map((assessment, index) => (
                <motion.div
                  key={assessment.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{getAssessmentIcon(assessment.category)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{assessment.categoryName}</h3>
                      <p className="text-sm text-gray-600">{formatDate(assessment.date)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getWellnessRecommendations(assessment.wellnessIndex).color}`}>
                      {assessment.wellnessIndex}/100
                    </div>
                    <div className="text-sm text-gray-600">{assessment.wellnessLevel}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Wellness Trends */}
        {assessments.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Wellness Trends</h2>
            <div className="h-64 flex items-end justify-center gap-2">
              {assessments.slice(-10).reverse().map((assessment, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-indigo-500 rounded-t"
                    style={{ height: `${assessment.wellnessIndex * 2}px` }}
                  />
                  <div className="text-xs text-gray-600 mt-2 transform -rotate-45">
                    {formatDate(assessment.date).split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-x-4"
        >
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Take New Assessment
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
          >
            💬 AI Support Chat
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardUpdated;
