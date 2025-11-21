import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaDownload, FaChartLine, FaTrophy, FaBook, FaUser } from 'react-icons/fa';

const Dashboard = ({ userId }) => {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [moodEntries, setMoodEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [journals, setJournals] = useState([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [currentMood, setCurrentMood] = useState(5);
  const [newGoal, setNewGoal] = useState('');
  const [newJournal, setNewJournal] = useState('');

  useEffect(() => {
    const fetchAssessmentHistory = async () => {
      try {
        if (isFirebaseConfigured && db) {
          const q = query(collection(db, 'assessments'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAssessmentHistory(history.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          // Fallback to localStorage when Firebase is not configured
          const localHistory = JSON.parse(localStorage.getItem(`mindease_history_${userId}`) || '[]');
          setAssessmentHistory(localHistory);
        }
      } catch (error) {
        console.error('Error fetching assessment history:', error);
        // Fallback to localStorage
        const localHistory = JSON.parse(localStorage.getItem(`mindease_history_${userId}`) || '[]');
        setAssessmentHistory(localHistory);
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false);
      }
    };

    // Add a timeout to ensure loading doesn't hang indefinitely
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 second timeout

    fetchAssessmentHistory();

    return () => clearTimeout(timeoutId);
  }, [userId]);

  const getRiskLevel = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 33) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage < 66) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getImprovementSuggestion = (current, previous) => {
    if (!previous) return "Keep up the good work!";
    if (current < previous) return "Great progress! You're improving.";
    if (current === previous) return "You're maintaining a stable level.";
    return "Consider additional support or revisit coping strategies.";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-indigo-600">Loading your dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</div>
        </div>
      </div>
    );
  }

  // Tab navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'mood', label: 'Mood Tracker', icon: FaCalendarAlt },
    { id: 'goals', label: 'Goals', icon: FaTrophy },
    { id: 'journal', label: 'Journal', icon: FaBook },
    { id: 'profile', label: 'Profile', icon: FaUser }
  ];

  const addMoodEntry = async () => {
    const moodData = {
      userId,
      mood: currentMood,
      date: new Date().toISOString(),
      note: ''
    };

    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'moods'), moodData);
      }
      // Update local state
      setMoodEntries(prev => [moodData, ...prev]);
      setShowMoodModal(false);
      setCurrentMood(5);
    } catch (error) {
      console.error('Error adding mood entry:', error);
    }
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;

    const goalData = {
      userId,
      title: newGoal,
      completed: false,
      date: new Date().toISOString()
    };

    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'goals'), goalData);
      }
      setGoals(prev => [goalData, ...prev]);
      setShowGoalModal(false);
      setNewGoal('');
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const addJournalEntry = async () => {
    if (!newJournal.trim()) return;

    const journalData = {
      userId,
      content: newJournal,
      date: new Date().toISOString()
    };

    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'journals'), journalData);
      }
      setJournals(prev => [journalData, ...prev]);
      setShowJournalModal(false);
      setNewJournal('');
    } catch (error) {
      console.error('Error adding journal entry:', error);
    }
  };

  const toggleGoal = async (goalId, completed) => {
    try {
      if (isFirebaseConfigured && db) {
        await updateDoc(doc(db, 'goals', goalId), { completed: !completed });
      }
      setGoals(prev => prev.map(goal =>
        goal.id === goalId ? { ...goal, completed: !completed } : goal
      ));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Assessment History */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assessment History</h2>
              <div className="space-y-4">
                {assessmentHistory.map((assessment, index) => {
                  const risk = getRiskLevel(assessment.score, assessment.maxScore);
                  const previousAssessment = assessmentHistory[index + 1];
                  const suggestion = getImprovementSuggestion(assessment.score, previousAssessment?.score);

                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{assessment.issue}</h3>
                          <p className="text-sm text-gray-500">{new Date(assessment.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color} ${risk.bg} bg-opacity-20`}>
                          {risk.level} Risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Score: {assessment.score}/{assessment.maxScore}
                      </p>
                      <p className="text-sm text-indigo-600 italic">{suggestion}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Progress Insights */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Progress Insights</h2>
              {assessmentHistory.length > 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{assessmentHistory.length}</div>
                    <div className="text-sm text-gray-600">Assessments Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {assessmentHistory.filter(a => getRiskLevel(a.score, a.maxScore).level === 'Low').length}
                    </div>
                    <div className="text-sm text-gray-600">Low Risk Assessments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {assessmentHistory[0] ? Math.round((assessmentHistory[0].score / assessmentHistory[0].maxScore) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Latest Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {assessmentHistory.length > 1 ? (() => {
                        const latest = assessmentHistory[0].score;
                        const previous = assessmentHistory[1].score;
                        const change = ((latest - previous) / previous) * 100;
                        return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
                      })() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Change from Last</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Complete more assessments to see progress insights.</p>
              )}
            </div>
          </div>
        );

      case 'mood':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Mood Tracker</h2>
                <button
                  onClick={() => setShowMoodModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> Add Mood
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm text-gray-600 py-2">{day}</div>
                ))}
                {/* Mood calendar would go here */}
              </div>

              <div className="space-y-4">
                {moodEntries.map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <span>Mood: {entry.mood}/10</span>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${entry.mood * 12}, 70%, 50%)` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Mental Health Goals</h2>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> Add Goal
                </button>
              </div>

              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={goal.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => toggleGoal(goal.id, goal.completed)}
                          className="w-5 h-5 text-green-600"
                        />
                        <span className={goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                          {goal.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(goal.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'journal':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Mental Health Journal</h2>
                <button
                  onClick={() => setShowJournalModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> New Entry
                </button>
              </div>

              <div className="space-y-4">
                {journals.map((entry, index) => (
                  <div key={entry.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600"><FaEdit /></button>
                        <button className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                      </div>
                    </div>
                    <p className="text-gray-700">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{userId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">Anonymous User</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Privacy</label>
                  <p className="text-sm text-gray-600">
                    Your data is stored securely and anonymously. All assessments and personal information are protected.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    <FaDownload /> Export My Data
                  </button>
                </div>
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
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 font-poppins">Your Mental Health Dashboard</h1>

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

        {/* Modals */}
        {showMoodModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
              <div className="mb-6">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1 - Very Low</span>
                  <span className="font-bold">Current: {currentMood}/10</span>
                  <span>10 - Excellent</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMoodModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addMoodEntry}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Mood
                </button>
              </div>
            </div>
          </div>
        )}

        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Add New Goal</h3>
              <textarea
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter your mental health goal..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {showJournalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">New Journal Entry</h3>
              <textarea
                value={newJournal}
                onChange={(e) => setNewJournal(e.target.value)}
                placeholder="Write about your thoughts and feelings..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
                rows="5"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJournalModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addJournalEntry}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'} // Navigate to home page
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Take Another Assessment
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
