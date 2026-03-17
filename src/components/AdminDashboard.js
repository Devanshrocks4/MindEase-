import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartLine, FaDownload, FaSearch, FaTrash, FaUserTimes } from 'react-icons/fa';
import io from 'socket.io-client';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    totalAssessments: 0,
    averageRiskScore: 0,
    issueBreakdown: {},
    riskLevelBreakdown: { Low: 0, Moderate: 0, High: 0 },
    recentAssessments: [],
    userStats: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [allAssessments, setAllAssessments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 50;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    // Socket.io connection for real-time updates
    const socket = io('http://localhost:5000');

    // Join admin room for real-time stats
    socket.emit('joinAdmin');

    // Listen for real-time stats updates
    socket.on('statsUpdate', (data) => {
      console.log('Real-time stats update:', data);
      setAnalytics(prev => ({
        ...prev,
        totalUsers: data.totalUsers || prev.totalUsers,
        totalAssessments: data.totalAssessments || prev.totalAssessments,
        averageRiskScore: data.averageRiskScore || prev.averageRiskScore,
        recentAssessments: data.recentAssessments || prev.recentAssessments,
        userStats: data.userStats || prev.userStats
      }));
    });

    // Listen for user online/offline
    socket.on('userOnline', (data) => {
      setOnlineUsers(prev => [...prev.filter(u => u._id !== data.userId), { _id: data.userId }]);
      setAnalytics(prev => ({ ...prev, onlineUsers: prev.onlineUsers + 1 }));
    });

    socket.on('userOffline', (data) => {
      setOnlineUsers(prev => prev.filter(u => u._id !== data.userId));
      setAnalytics(prev => ({ ...prev, onlineUsers: Math.max(0, prev.onlineUsers - 1) }));
    });

    // Listen for new user
    socket.on('newUser', (data) => {
      setAnalytics(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
    });

    // Listen for user login
    socket.on('userLogin', (data) => {
      setRecentLogins(prev => [data, ...prev.slice(0, 9)]);
    });

    // Listen for new assessment
    socket.on('newAssessment', (data) => {
      setRecentAssessments(prev => [data, ...prev.slice(0, 9)]);
      setAnalytics(prev => ({ ...prev, totalAssessments: prev.totalAssessments + 1 }));
    });

    const fetchAnalytics = async () => {
      try {
        // Fetch analytics
        try {
          const analyticsResponse = await fetch('http://localhost:5000/api/admin/analytics', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
            }
          });

          if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json();
            if (analyticsData.success) {
              setAnalytics(analyticsData.data);
            }
          }
        } catch (apiError) {
          console.log('Analytics API not available, using demo data');
        }

        // Fetch all users
        try {
          const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
            }
          });

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            if (usersData.success) {
              let users = usersData.data;
              // If API returns less than 10 users (demo mode), generate more
              if (users.length < 10) {
                const additionalUsers = [];
                for (let i = users.length + 1; i <= 10; i++) {
                  const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
                  const lastLogin = Math.random() > 0.3 ? new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())) : null;
                  additionalUsers.push({
                    _id: `user_${i}`,
                    name: `Demo User ${i}`,
                    email: `demo${i}@example.com`,
                    role: 'user',
                    lastLogin,
                    createdAt,
                    status: Math.random() > 0.8 ? 'inactive' : 'active'
                  });
                }
                users = [...users, ...additionalUsers];
              }
              // Sort by createdAt descending (newest first)
              users.sort((a, b) => b.createdAt - a.createdAt);
              setAllUsers(users);
            }
          }
        } catch (error) {
          console.log('Users API not available');
        }

        // Fetch recent logins
        try {
          const loginsResponse = await fetch('http://localhost:5000/api/admin/recent-logins', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
            }
          });

          if (loginsResponse.ok) {
            const loginsData = await loginsResponse.json();
            if (loginsData.success) {
              setRecentLogins(loginsData.data);
            }
          }
        } catch (error) {
          console.log('Recent logins API not available');
        }

        // Fetch recent assessments
        try {
          const assessmentsResponse = await fetch('http://localhost:5000/api/admin/recent-assessments', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
            }
          });

          if (assessmentsResponse.ok) {
            const assessmentsData = await assessmentsResponse.json();
            if (assessmentsData.success) {
              setRecentAssessments(assessmentsData.data);
              setAnalytics(prev => ({ ...prev, recentAssessmentsCount: assessmentsData.count || 0 }));
            }
          }
        } catch (error) {
          console.log('Recent assessments API not available');
        }

        // Fetch all assessments
        try {
          const allAssessmentsResponse = await fetch('http://localhost:5000/api/admin/assessments', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
            }
          });

          if (allAssessmentsResponse.ok) {
            const allAssessmentsData = await allAssessmentsResponse.json();
            if (allAssessmentsData.success) {
              setAllAssessments(allAssessmentsData.data);
            }
          }
        } catch (error) {
          console.log('All assessments API not available');
        }

        // Fallback to demo data if API fails
        const demoData = {
          totalUsers: 15,
          totalAssessments: 45,
          averageRiskScore: 6.8,
          issueBreakdown: {
            stress: 7,
            depression: 6,
            anxiety: 8,
            sleep: 4,
            social: 3,
            behavioral: 2,
            emotional: 3,
            decision: 2,
            confidence: 3,
            digital: 2
          },
          riskLevelBreakdown: { Low: 8, Moderate: 5, High: 2 },
          recentAssessments: [
            { id: 1, userName: 'Demo User 1', userEmail: 'demo1@example.com', type: 'stress', score: 8.5, riskLevel: 'High', date: '2024-01-15' },
            { id: 2, userName: 'Demo User 2', userEmail: 'demo2@example.com', type: 'depression', score: 6.2, riskLevel: 'Moderate', date: '2024-01-14' },
            { id: 3, userName: 'Demo User 3', userEmail: 'demo3@example.com', type: 'anxiety', score: 9.1, riskLevel: 'High', date: '2024-01-14' },
            { id: 4, userName: 'Demo User 4', userEmail: 'demo4@example.com', type: 'sleep', score: 4.3, riskLevel: 'Low', date: '2024-01-13' },
            { id: 5, userName: 'Demo User 5', userEmail: 'demo5@example.com', type: 'social', score: 7.8, riskLevel: 'High', date: '2024-01-13' }
          ],
          userStats: [
            { id: 'user_1', name: 'Demo User 1', email: 'demo1@example.com', totalAssessments: 3, averageScore: 7.2, lastAssessment: '2024-01-15', status: 'Active' },
            { id: 'user_2', name: 'Demo User 2', email: 'demo2@example.com', totalAssessments: 2, averageScore: 6.5, lastAssessment: '2024-01-14', status: 'Active' },
            { id: 'user_3', name: 'Demo User 3', email: 'demo3@example.com', totalAssessments: 4, averageScore: 8.1, lastAssessment: '2024-01-14', status: 'Needs Attention' },
            { id: 'user_4', name: 'Demo User 4', email: 'demo4@example.com', totalAssessments: 1, averageScore: 4.8, lastAssessment: '2024-01-13', status: 'Active' },
            { id: 'user_5', name: 'Demo User 5', email: 'demo5@example.com', totalAssessments: 2, averageScore: 7.5, lastAssessment: '2024-01-13', status: 'Active' }
          ]
        };

        if (!analytics.totalUsers) setAnalytics(demoData);
        if (!allUsers.length) {
          // Generate 15 demo users
          const demoUsers = [];
          for (let i = 1; i <= 15; i++) {
            const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Random date within last year
            const lastLogin = Math.random() > 0.3 ? new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime())) : null;
            demoUsers.push({
              _id: `user_${i}`,
              name: `Demo User ${i}`,
              email: `demo${i}@example.com`,
              role: 'user',
              lastLogin,
              createdAt,
              status: Math.random() > 0.8 ? 'inactive' : 'active'
            });
          }
          // Sort by createdAt descending (newest first)
          demoUsers.sort((a, b) => b.createdAt - a.createdAt);
          setAllUsers(demoUsers);
        }
        if (!recentLogins.length) setRecentLogins([]);
        if (!recentAssessments.length) setRecentAssessments(demoData.recentAssessments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, [allUsers.length, analytics.totalUsers, recentAssessments.length, recentLogins.length]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.data);
      }
    } catch (error) {
      console.log('Using demo user details');
      setUserDetails({
        assessments: user.assessments,
        avgScore: user.avgScore,
        lastActive: user.lastActive,
        status: user.status,
        recentAssessments: [
          { type: 'stress', score: 8.5, date: '2024-01-15' },
          { type: 'depression', score: 6.2, date: '2024-01-10' }
        ]
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
          }
        });
        if (response.ok) {
          // Remove from all users list
          setAllUsers(prev => prev.filter(user => user._id !== userId));

          // Update analytics immediately
          setAnalytics(prev => {
            const wasOnline = onlineUsers.some(ou => ou._id === userId);
            const wasHighRisk = prev.userStats.some(user => user.id === userId && user.averageScore > 7);
            const userAssessments = prev.userStats.find(user => user.id === userId)?.totalAssessments || 3; // Assume 3 for demo

            return {
              ...prev,
              totalUsers: prev.totalUsers - 1,
              onlineUsers: wasOnline ? prev.onlineUsers - 1 : prev.onlineUsers,
              totalAssessments: prev.totalAssessments - userAssessments,
              userStats: prev.userStats.filter(user => user.id !== userId),
              riskLevelBreakdown: {
                ...prev.riskLevelBreakdown,
                High: wasHighRisk ? prev.riskLevelBreakdown.High - 1 : prev.riskLevelBreakdown.High
              }
            };
          });

          // Remove from online users if they were online
          setOnlineUsers(prev => prev.filter(ou => ou._id !== userId));
        }
      } catch (error) {
        console.log('Demo delete - user would be removed');
        // For demo purposes, still remove from UI and update counts
        setAllUsers(prev => prev.filter(user => user._id !== userId));

        setAnalytics(prev => {
          const wasOnline = onlineUsers.some(ou => ou._id === userId);
          const wasHighRisk = prev.userStats.some(user => user.id === userId && user.averageScore > 7);
          const userAssessments = prev.userStats.find(user => user.id === userId)?.totalAssessments || 3;

          return {
            ...prev,
            totalUsers: prev.totalUsers - 1,
            onlineUsers: wasOnline ? prev.onlineUsers - 1 : prev.onlineUsers,
            totalAssessments: prev.totalAssessments - userAssessments,
            userStats: prev.userStats.filter(user => user.id !== userId),
            riskLevelBreakdown: {
              ...prev.riskLevelBreakdown,
              High: wasHighRisk ? prev.riskLevelBreakdown.High - 1 : prev.riskLevelBreakdown.High
            }
          };
        });

        setOnlineUsers(prev => prev.filter(ou => ou._id !== userId));
      }
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    setAddingUser(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || 'demo_token'}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const data = await response.json();
        // Add to all users list
        setAllUsers(prev => [data.data, ...prev]);

        // Update analytics
        setAnalytics(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));

        // Reset form and close modal
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        setShowAddModal(false);
        alert('User added successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add user');
      }
    } catch (error) {
      console.log('Demo add - user would be added');
      // For demo purposes, add to UI
      const demoUser = {
        _id: `demo_${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        lastLogin: null,
        createdAt: new Date(),
        status: 'active'
      };
      setAllUsers(prev => [demoUser, ...prev]);
      setAnalytics(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      setShowAddModal(false);
      alert('User added successfully (demo)');
    } finally {
      setAddingUser(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filterCategory === 'new') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      matchesFilter = new Date(user.createdAt) > sevenDaysAgo;
    } else if (filterCategory === 'current') {
      matchesFilter = onlineUsers.some(ou => ou._id === user._id);
    } else if (filterCategory === 'active') {
      matchesFilter = user.status === 'active';
    } else if (filterCategory === 'needs attention') {
      matchesFilter = user.status === 'suspended' || user.status === 'inactive';
    }
    return matchesSearch && matchesFilter;
  });

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Last Login', 'Status'],
      ...filteredUsers.map(user => [user.name, user.email, user.role, user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never', user.status])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-slate-800/50 rounded-xl p-2 backdrop-blur-sm">
          {['overview', 'users', 'groups', 'chats', 'assessments', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg"
              >
                <FaUsers className="text-3xl mb-4" />
                <h3 className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</h3>
                <p className="text-blue-100">Total Users</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl shadow-lg"
              >
                <FaUsers className="text-3xl mb-4" />
                <h3 className="text-2xl font-bold">{analytics.onlineUsers}</h3>
                <p className="text-cyan-100">Online Users</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg"
              >
                <FaChartLine className="text-3xl mb-4" />
                <h3 className="text-2xl font-bold">{analytics.totalAssessments.toLocaleString()}</h3>
                <p className="text-green-100">Total Assessments</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg"
              >
                <FaUsers className="text-3xl mb-4" />
                <h3 className="text-2xl font-bold">{recentLogins.length}</h3>
                <p className="text-purple-100">Recent Logins (24h)</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg"
              >
                <FaChartLine className="text-3xl mb-4" />
                <h3 className="text-2xl font-bold">{analytics.recentAssessmentsCount || recentAssessments.length}</h3>
                <p className="text-orange-100">Recent Assessments (24h)</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg"
              >
                <FaUserTimes className="text-3xl mb-4" />
                <h3 className="text-2xl font-bold">{analytics.riskLevelBreakdown.High}</h3>
                <p className="text-red-100">High Risk Users</p>
              </motion.div>
            </div>

            {/* High Risk Users List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">High Risk Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Avg Score</th>
                      <th className="pb-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.userStats
                      .filter(user => user.averageScore > 7)
                      .slice(0, 10)
                      .map((user) => (
                        <motion.tr
                          key={user.userId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                          onClick={() => handleUserSelect({ id: user.userId, ...user })}
                        >
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">{user.averageScore.toFixed(1)}</td>
                          <td className="py-3">{user.lastAssessment ? new Date(user.lastAssessment).toLocaleDateString() : 'N/A'}</td>
                        </motion.tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">User Management</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Users</option>
                  <option value="new">New Users</option>
                  <option value="current">Current Users</option>
                  <option value="active">Active</option>
                  <option value="needs attention">Needs Attention</option>
                </select>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                  <FaUsers /> Add User
                </button>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  <FaDownload /> Export Data
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Last Login</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">{user.role}</td>
                      <td className="py-3">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          user.status === 'inactive' || user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user._id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Next
                </button>
                <span className="ml-4 text-gray-400">
                  Page {currentPage} of {totalPages} ({filteredUsers.length} users)
                </span>
              </div>
            )}

            {selectedUser && userDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-slate-700/50 rounded-xl"
              >
                <h3 className="text-xl font-bold mb-4">User Details: {selectedUser.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Assessments Taken:</strong> {userDetails.assessments}</p>
                    <p><strong>Average Score:</strong> {userDetails.avgScore.toFixed(1)}</p>
                    <p><strong>Last Active:</strong> {userDetails.lastActive}</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong> {userDetails.status}</p>
                    <p><strong>Recent Assessments:</strong></p>
                    <ul className="list-disc list-inside">
                      {userDetails.recentAssessments.map((assessment, index) => (
                        <li key={index}>
                          {assessment.type}: {assessment.score} ({assessment.date})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">All Assessments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Assessment Type</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Risk Level</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allAssessments.map((assessment) => (
                    <motion.tr
                      key={assessment._id || assessment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-700 hover:bg-slate-700/50"
                    >
                      <td className="py-3">{assessment.userId?.name || assessment.userName}</td>
                      <td className="py-3">{assessment.userId?.email || assessment.userEmail}</td>
                      <td className="py-3">{assessment.category || assessment.type}</td>
                      <td className="py-3">{assessment.wellnessIndex || assessment.score}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (assessment.wellnessIndex || assessment.score) < 33 ? 'bg-green-500/20 text-green-400' :
                          (assessment.wellnessIndex || assessment.score) < 66 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {(assessment.wellnessIndex || assessment.score) < 33 ? 'Low' :
                           (assessment.wellnessIndex || assessment.score) < 66 ? 'Moderate' : 'High'}
                        </span>
                      </td>
                      <td className="py-3">{assessment.testDate ? new Date(assessment.testDate).toLocaleDateString() : assessment.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Issue Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(analytics.issueBreakdown).map(([issue, count]) => (
                  <div key={issue} className="flex justify-between items-center">
                    <span className="capitalize">{issue}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(analytics.issueBreakdown))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Risk Level Distribution</h3>
              <div className="space-y-4">
                {Object.entries(analytics.riskLevelBreakdown).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      level === 'Low' ? 'bg-green-500/20 text-green-400' :
                      level === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {level}
                    </span>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={addingUser}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                >
                  {addingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
