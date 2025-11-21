import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ASSESSMENT_DATA } from '../data/assessmentData';

const AssessmentTest = () => {
  const { type } = useParams();
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const assessmentData = ASSESSMENT_DATA[type];
  const questions = assessmentData ? assessmentData.questions : [];
  const maxScore = assessmentData ? assessmentData.maxScore : 0;
  const responseOptions = assessmentData ? assessmentData.options : [];

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, val) => sum + (val || 0), 0);
  };

  const getSeverity = (score) => {
    if (assessmentData && assessmentData.getSeverity) {
      return assessmentData.getSeverity(score);
    }
    // Fallback for old hardcoded tests
    if (type === 'phq9') {
      if (score <= 4) return { level: 'Minimal depression', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 9) return { level: 'Mild depression', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 14) return { level: 'Moderate depression', color: 'text-orange-600', bg: 'bg-orange-50' };
      if (score <= 19) return { level: 'Moderately severe depression', color: 'text-red-600', bg: 'bg-red-50' };
      return { level: 'Severe depression', color: 'text-red-700', bg: 'bg-red-100' };
    } else {
      if (score <= 4) return { level: 'Minimal anxiety', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 9) return { level: 'Mild anxiety', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 14) return { level: 'Moderate anxiety', color: 'text-orange-600', bg: 'bg-orange-50' };
      return { level: 'Severe anxiety', color: 'text-red-600', bg: 'bg-red-50' };
    }
  };

  const getSuggestions = (severity) => {
    const suggestions = {
      'Minimal depression': [
        "Continue maintaining healthy habits",
        "Regular exercise helps prevent depression",
        "Practice mindfulness and gratitude",
        "Stay connected with friends and family"
      ],
      'Mild depression': [
        "Consider self-care strategies",
        "Try meditation or yoga",
        "Journal your thoughts and feelings",
        "Consider talking to a trusted friend"
      ],
      'Moderate depression': [
        "Professional support would be helpful",
        "Consider therapy or counseling",
        "Build a support network",
        "Practice stress management techniques"
      ],
      'Moderately severe depression': [
        "Seek professional help soon",
        "Contact a mental health professional",
        "Consider medication options with a doctor",
        "Don't try to manage this alone"
      ],
      'Severe depression': [
        "Seek immediate professional help",
        "Contact crisis hotline: 988 (US) or local emergency services",
        "Go to nearest emergency room if needed",
        "You are not alone - help is available"
      ],
      'Minimal anxiety': [
        "Continue your healthy routines",
        "Practice deep breathing exercises",
        "Stay physically active",
        "Maintain good sleep habits"
      ],
      'Mild anxiety': [
        "Try relaxation techniques",
        "Consider mindfulness meditation",
        "Limit caffeine and stimulants",
        "Practice progressive muscle relaxation"
      ],
      'Moderate anxiety': [
        "Professional help is recommended",
        "Consider cognitive behavioral therapy",
        "Learn anxiety management techniques",
        "Build coping strategies"
      ],
      'Severe anxiety': [
        "Seek professional help immediately",
        "Contact a mental health professional",
        "Consider medication options",
        "Don't wait - anxiety can be treated effectively"
      ]
    };
    return suggestions[severity] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    const unanswered = questions.filter((_, index) => responses[index] === undefined);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} remaining.`);
      return;
    }

    setLoading(true);
    try {
      const score = calculateScore();
      const severity = getSeverity(score);
      const suggestions = getSuggestions(severity.level);

      const assessmentData = {
        userId,
        type: type.toUpperCase(),
        score,
        maxScore,
        severity: severity.level,
        responses: Object.values(responses),
        suggestions,
        date: new Date().toISOString(),
        completed: true
      };

      if (isFirebaseConfigured && db) {
        // Save to Firebase
        const docRef = await addDoc(collection(db, 'assessments'), assessmentData);
        assessmentData.id = docRef.id;
      }

      // Save to localStorage as backup
      const localHistory = JSON.parse(localStorage.getItem(`mindease_history_${userId}`) || '[]');
      localHistory.unshift(assessmentData);
      localStorage.setItem(`mindease_history_${userId}`, JSON.stringify(localHistory));

      toast.success('Assessment completed successfully!');
      navigate('/results', { state: { assessment: assessmentData } });

    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fallbackOptions = [
    { value: 0, label: "Not at all", description: "(0 points)" },
    { value: 1, label: "Several days", description: "(1 point)" },
    { value: 2, label: "More than half the days", description: "(2 points)" },
    { value: 3, label: "Nearly every day", description: "(3 points)" }
  ];

  const displayOptions = responseOptions.length > 0 ? responseOptions : fallbackOptions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">
              {assessmentData ? assessmentData.name : (type === 'phq9' ? 'PHQ-9 Depression Assessment' : 'GAD-7 Anxiety Assessment')}
            </h1>
            <p className="text-gray-600">
              {assessmentData
                ? `This assessment helps identify symptoms of ${assessmentData.category.toLowerCase()}.`
                : (type === 'phq9'
                  ? 'This assessment helps identify symptoms of depression over the past 2 weeks.'
                  : 'This assessment helps identify symptoms of anxiety over the past 2 weeks.'
                )
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Answer each question based on how often you've been bothered by that problem in the past 2 weeks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {index + 1}. {question}
                </h3>
                <div className="space-y-3">
                  {displayOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.value}
                        checked={responses[index] === option.value}
                        onChange={() => handleResponseChange(index, option.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">
                        {option.label} <span className="text-sm text-gray-500">{option.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Assessment'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentTest;
