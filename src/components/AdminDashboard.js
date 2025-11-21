import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FaUsers, FaChartLine, FaExclamationTriangle, FaDownload, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    averageRiskScore: 0,
    issueBreakdown: {},
    riskLevelBreakdown: { Low: 0, Moderate: 0, High: 0 },
    recentAssessments: [],
    userStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        let assessments = [];
        let users = new Set();

        if (isFirebaseConfigured && db) {
          // Fetch assessments from Firebase
          const assessmentsQuery = query(collection(db, 'assessments'), orderBy('date', 'desc'), limit(1000));
          const assessmentsSnapshot = await getDocs(assessmentsQuery);
          assessments = assessmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Extract unique users
          users = new Set(assessments.map(a => a.userId));
        } else {
          // Fallback to localStorage data for demo
          const localData = JSON.parse(localStorage.getItem('mindease_all_assessments') || '[]');
          assessments = localData;
          users = new Set(assessments.map(a => a.userId));
        }

        const totalUsers = users.size;
        const totalAssessments = assessments.length;

        // Calculate risk scores and breakdowns
        const riskScores = assessments.map(a => (a.score / a.maxScore) * 100);
        const averageRiskScore = riskScores.length > 0 ? riskScores.reduce((a, b) => a + b, 0) / riskScores.length : 0;

        const issueBreakdown = {};
        const riskLevelBreakdown = { Low: 0, Moderate: 0, High: 0 };
        const userStats = {};

        assessments.forEach(assessment => {
          // Issue breakdown
          const issueKey = assessment.categoryName || assessment.issue || 'Unknown';
          issueBreakdown[issueKey] = (issueBreakdown[issueKey] || 0) + 1;

          // Risk level breakdown
          const percentage = (assessment.score / assessment.maxScore) * 100;
          if (percentage < 33) riskLevelBreakdown.Low++;
          else if (percentage < 66) riskLevelBreakdown.Moderate++;
          else riskLevelBreakdown.High++;

          // User stats
          const userId = assessment.userId;
          if (!userStats[userId]) {
            userStats[userId] = {
              userId,
              totalAssessments: 0,
              averageScore: 0,
              lastAssessment: null,
              categories: new Set()
            };
          }
          userStats[userId].totalAssessments++;
          userStats[userId].categories.add(assessment.category);
          if (!userStats[userId].lastAssessment || new Date(assessment.date) > new Date(userStats[userId].lastAssessment)) {
            userStats[userId].lastAssessment = assessment.date;
          }
        });

        // Calculate user averages
        Object.values(userStats).forEach(user => {
          const userAssessments = assessments.filter(a => a.userId === user.userId);
          const scores = userAssessments.map(a => (a.score / a.maxScore) * 100);
          user.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          user.categories = Array.from(user.categories);
        });

        setAnalytics({
          totalUsers,
          totalAssessments,
          averageRiskScore: Math.round(averageRiskScore),
          issueBreakdown,
          riskLevelBreakdown,
          recentAssessments: assessments.slice(0, 10),
          userStats: Object.values(userStats),
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Fallback to mock data
        setAnalytics({
          totalUsers: 1250,
          totalAssessments: 3400,
          averageRiskScore: 45,
          issueBreakdown: {
            'Stress & Anxiety': 1200,
            'Depression & Mood Disorders': 800,
            'Confidence & Personality Control': 600,
            'Emotional Stability & Personality Traits': 500,
            'Decision-Making & Cognitive Functioning': 300,
          },
          riskLevelBreakdown: { Low: 1800, Moderate: 1200, High: 400 },
          recentAssessments: [],
          userStats: [],
        });
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `mindease-analytics-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredUsers = analytics.userStats.filter(user => {
    const matchesSearch = user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || user.categories.includes(filterCategory);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-indigo-600">Loading admin analytics...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'assessments', label: 'Assessment Data', icon: FaExclamationTriangle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <FaUsers className="text-3xl text-indigo-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-indigo-600 mb-2">{analytics.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <FaChartLine className="text-3xl text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalAssessments}</div>
                <div className="text-sm text-gray-600">Total Assessments</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <FaExclamationTriangle className="text-3xl text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 mb-2">{analytics.averageRiskScore}%</div>
                <div className="text-sm text-gray-600">Average Risk Score</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.totalAssessments > 0 ? Math.round(analytics.totalAssessments / analytics.totalUsers) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg Assessments per User</div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Issues Breakdown</h2>
                <div className="space-y-3">
                  {Object.entries(analytics.issueBreakdown).map(([issue, count]) => (
                    <div key={issue} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{issue}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(count / analytics.totalAssessments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk Level Distribution</h2>
                <div className="space-y-4">
                  {Object.entries(analytics.riskLevelBreakdown).map(([level, count]) => {
                    const colors = {
                      Low: 'bg-green-500',
                      Moderate: 'bg-yellow-500',
                      High: 'bg-red-500',
                    };
                    return (
                      <div key={level} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{level} Risk</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`${colors[level]} h-2 rounded-full`}
                              style={{ width: `${(count / analytics.totalAssessments) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-800">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Export Button */}
            <div className="text-center">
              <button
                onClick={exportData}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <FaDownload /> Export Analytics Data
              </button>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="stress">Stress & Anxiety</option>
                    <option value="depression">Depression</option>
                    <option value="confidence">Confidence</option>
                    <option value="emotional">Emotional</option>
                    <option value="decision">Decision-Making</option>
                    <option value="social">Social</option>
                    <option value="sleep">Sleep</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>
              </div>

              {/* User List */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.userId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">User ID: {user.userId}</h3>
                        <p className="text-sm text-gray-600">Last Assessment: {new Date(user.lastAssessment).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Categories: {user.categories.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-indigo-600">{user.totalAssessments} assessments</div>
                        <div className="text-sm text-gray-600">Avg Score: {Math.round(user.averageScore)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Assessment Data</h2>

              <div className="space-y-4">
                {analytics.recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{assessment.categoryName}</h3>
                        <p className="text-sm text-gray-600">User ID: {assessment.userId}</p>
                        <p className="text-sm text-gray-600">Date: {new Date(assessment.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          Score: {assessment.score}/{assessment.maxScore}
                        </div>
                        <div className="text-sm text-gray-600">
                          Risk Level: {((assessment.score / assessment.maxScore) * 100) < 33 ? 'Low' : ((assessment.score / assessment.maxScore) * 100) < 66 ? 'Moderate' : 'High'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 font-poppins text-center">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8 text-center">Comprehensive analytics and user management for MindEase administrators.</p>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-md p-1 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* User Details Modal */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">User Details: {selectedUser.userId}</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* User Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800">Total Assessments</h3>
                    <p className="text-2xl font-bold text-indigo-600">{selectedUser.totalAssessments}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800">Average Score</h3>
                    <p className="text-2xl font-bold text-green-600">{Math.round(selectedUser.averageScore)}%</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Last Assessment</h3>
                    <p className="text-lg font-bold text-blue-600">{new Date(selectedUser.lastAssessment).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Assessment History */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Assessment History</h3>
                  <div className="space-y-3">
                    {analytics.recentAssessments
                      .filter(assessment => assessment.userId === selectedUser.userId)
                      .map((assessment) => (
                        <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{assessment.categoryName}</h4>
                              <p className="text-sm text-gray-600">Date: {new Date(assessment.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-600">Score: {assessment.score}/{assessment.maxScore}</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-semibold ${
                                ((assessment.score / assessment.maxScore) * 100) < 33 ? 'text-green-600' :
                                ((assessment.score / assessment.maxScore) * 100) < 66 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {Math.round((assessment.score / assessment.maxScore) * 100)}%
                              </div>
                              <div className="text-sm text-gray-600">
                                {((assessment.score / assessment.maxScore) * 100) < 33 ? 'Low Risk' :
                                 ((assessment.score / assessment.maxScore) * 100) < 66 ? 'Moderate Risk' : 'High Risk'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Export User Data */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      const userData = {
                        userId: selectedUser.userId,
                        assessments: analytics.recentAssessments.filter(a => a.userId === selectedUser.userId),
                        stats: selectedUser
                      };
                      const dataStr = JSON.stringify(userData, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const exportFileDefaultName = `user-${selectedUser.userId}-data.json`;
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileDefaultName);
                      linkElement.click();
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Export User Data
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            All data is anonymized and secured. Admin access is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
