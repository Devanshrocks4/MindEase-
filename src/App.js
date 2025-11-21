import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import DashboardUpdated from './components/Dashboard_updated';
import AssessmentTest from './components/AssessmentTest_updated';
import ResultsPage from './components/ResultsPage_updated';
import Chat from './components/Chat';
import Counselors from './components/Counselors';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import './App.css';

function App() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const issues = [
    {
      id: 'stress',
      title: 'Stress & Anxiety',
      icon: '🧠',
      test: 'Comprehensive Stress Assessment',
      type: 'stress',
      description: 'Perceived stress, physical symptoms, generalized worry, panic symptoms, social anxiety',
      tests: ['PSS (Perceived Stress Scale – 10 items)', 'GAD-7 (Generalized Anxiety Disorder Scale – 7 items)']
    },
    {
      id: 'depression',
      title: 'Depression & Mood Disorders',
      icon: '😔',
      test: 'Comprehensive Mood Assessment',
      type: 'depression',
      description: 'Low mood, loss of interest, hopelessness, lack of energy, suicidal thoughts',
      tests: ['PHQ-9 (Patient Health Questionnaire – 9 items)']
    },
    {
      id: 'confidence',
      title: 'Confidence & Personality Control',
      icon: '💪',
      test: 'Self-Esteem & Control Assessment',
      type: 'confidence',
      description: 'Self-confidence, sense of control, motivation, persistence, resilience',
      tests: ['Rosenberg Self-Esteem Scale (RSES – 10 items)', 'Rotter\'s Locus of Control Scale (13 items)']
    },
    {
      id: 'emotional',
      title: 'Emotional Stability & Personality Traits',
      icon: '💔',
      test: 'Emotional Regulation Assessment',
      type: 'emotional',
      description: 'Emotional regulation, neuroticism, anger control, impulse control, social behavior',
      tests: ['DERS (Difficulties in Emotion Regulation Scale)', 'Big Five Personality Test (OCEAN)']
    },
    {
      id: 'decision',
      title: 'Decision-Making & Cognitive Functioning',
      icon: '🤔',
      test: 'Cognitive Assessment',
      type: 'decision',
      description: 'Impulse control, risk-taking, problem-solving, attention & focus, working memory',
      tests: ['Barratt Impulsiveness Scale (BIS-11)', 'Cognitive Failures Questionnaire (CFQ)']
    },
    {
      id: 'social',
      title: 'Social Relationships & Interpersonal Issues',
      icon: '👥',
      test: 'Social Skills Assessment',
      type: 'social',
      description: 'Communication, empathy, social conflict, support system, relationship quality',
      tests: ['Social Skills Inventory (SSI)', 'UCLA Loneliness Scale']
    },
    {
      id: 'sleep',
      title: 'Sleep Issues',
      icon: '😴',
      test: 'Sleep Quality Assessment',
      type: 'sleep',
      description: 'Sleep quality, difficulty falling asleep, daytime tiredness, insomnia patterns',
      tests: ['Pittsburgh Sleep Quality Index (PSQI)']
    },
    {
      id: 'behavioral',
      title: 'Behavioral & Lifestyle Factors',
      icon: '🏃‍♂️',
      test: 'Lifestyle Assessment',
      type: 'behavioral',
      description: 'Addictive behavior, eating habits, physical activity, screen time, work-life balance',
      tests: ['EAT-26 (Eating Attitude Test)', 'IPAQ (Physical Activity Score)']
    },
    {
      id: 'digital',
      title: 'Digital Well-Being & Technology Impact',
      icon: '🔥',
      test: 'Digital Wellness Assessment',
      type: 'digital',
      description: 'Internet addiction, smartphone usage, digital wellness, technology impact on mental health',
      tests: ['Internet Addiction Test (IAT – 20 items)', 'Smartphone Addiction Scale – Short Version (SAS-SV)']
    }
  ];



  const handleIssueClick = (issue) => {
    // Navigate to specific test routes for all assessment types
    navigate(`/assessment/${issue.id}`);
  };

  const HomePage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-skyblue via-lavender to-mint p-6"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-800 mb-6 font-poppins drop-shadow-lg"
      >
        MindEase AI
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-700 mb-8 text-center max-w-md drop-shadow-md"
      >
        Your safe space for self-assessment and emotional well-being
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
      >
        {issues.map((issue, index) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            onClick={() => handleIssueClick(issue)}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all card-3d hover:bg-gradient-to-br hover:from-neon-blue/10 hover:to-neon-purple/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-4xl mb-3">{issue.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 drop-shadow-md">{issue.title}</h2>
            <p className="text-sm text-gray-600 drop-shadow-sm">{issue.test}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap justify-center gap-4 mb-6"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-3 rounded-xl hover:from-neon-purple hover:to-neon-pink transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium animate-pulse-fast"
        >
          📊 View Dashboard
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="bg-gradient-to-r from-neon-green to-vibrant-emerald text-white px-6 py-3 rounded-xl hover:from-vibrant-emerald hover:to-neon-cyan transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium animate-pulse-fast"
        >
          💬 AI Support Chat
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gradient-to-r from-vibrant-violet to-neon-magenta text-white px-6 py-3 rounded-xl hover:from-neon-magenta hover:to-vibrant-fuchsia transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm font-medium animate-pulse-fast"
        >
          👨‍💼 Admin Panel
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center"
      >
        <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-gray-200 shadow-md">
          🔒 Secure & Anonymous Session
        </p>
      </motion.div>
    </motion.div>
  );





  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assessment/:type" element={<AssessmentTest />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardUpdated /></ProtectedRoute>} />
        <Route path="/chat" element={<Chat userId={userId} />} />
        <Route path="/counselors" element={<Counselors />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
