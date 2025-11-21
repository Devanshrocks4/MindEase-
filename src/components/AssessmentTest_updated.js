import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { db, isFirebaseConfigured } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ASSESSMENT_DATA, getOverallWellnessIndex, getWellnessRecommendations } from '../data/assessmentData_complete';

const AssessmentTest = () => {
  const { type } = useParams();
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [completedTests, setCompletedTests] = useState([]);
  const { userId, currentUser } = useAuth();
  const navigate = useNavigate();

  // Map category types to their test keys - exactly as specified in requirements
  const categoryTests = {
    stress: ['pss', 'gad7'], // PSS (10 items) + GAD-7 (7 items)
    depression: ['phq9'], // PHQ-9 (9 items) only
    confidence: ['rses'], // RSES (10 items) only - as per requirements
    emotional: ['ders'], // DERS only (as specified)
    decision: ['bis11'], // BIS-11 only - as per requirements
    social: ['ucla_loneliness'], // UCLA Loneliness only - as per requirements
    sleep: ['psqi'], // PSQI only (as specified)
    behavioral: ['eat26'], // EAT-26 only (as specified)
    digital: ['iat', 'sassv'] // IAT (20 items) + SAS-SV
  };

  const currentTestKeys = categoryTests[type] || [type];
  const currentTestKey = currentTestKeys[currentTestIndex];
  const assessmentData = ASSESSMENT_DATA[currentTestKey];

  const questions = assessmentData ? assessmentData.questions : [];
  const maxScore = assessmentData ? assessmentData.maxScore : 0;
  const responseOptions = assessmentData ? assessmentData.options : [];

  const handleResponseChange = (questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const calculateTestScore = () => {
    if (!assessmentData) return 0;

    let totalScore = 0;
    Object.entries(responses).forEach(([questionIndex, answerIndex]) => {
      const points = assessmentData.options[answerIndex]?.points || 0;

      // Apply reverse scoring if needed
      if (assessmentData.reverseScored && assessmentData.reverseScored.includes(parseInt(questionIndex))) {
        const maxPoints = Math.max(...assessmentData.options.map(opt => opt.points));
        totalScore += (maxPoints - points);
      } else {
        totalScore += points;
      }
    });

    return totalScore;
  };

  const handleNextTest = async () => {
    const score = calculateTestScore();
    const severity = assessmentData.getSeverity(score);

    const testResult = {
      testKey: currentTestKey,
      testName: assessmentData.name,
      score,
      maxScore,
      severity: severity.level,
      color: severity.color,
      bg: severity.bg,
      responses: { ...responses },
      date: new Date().toISOString()
    };

    setCompletedTests(prev => [...prev, testResult]);

    // Move to next test or finish
    if (currentTestIndex < currentTestKeys.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
      setResponses({}); // Reset responses for next test
    } else {
      // All tests completed, save and navigate to results
      await saveCompleteAssessment([...completedTests, testResult]);
    }
  };

  const saveCompleteAssessment = async (allTestResults) => {
    setLoading(true);
    try {
      const wellnessIndex = getOverallWellnessIndex(allTestResults);
      const wellnessData = getWellnessRecommendations(wellnessIndex);

      const assessmentData = {
        userId,
        userName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anonymous User',
        userEmail: currentUser?.email || 'anonymous@example.com',
        category: type,
        categoryName: type.charAt(0).toUpperCase() + type.slice(1) + ' Assessment',
        testResults: allTestResults,
        wellnessIndex,
        wellnessLevel: wellnessData.level,
        wellnessColor: wellnessData.color,
        wellnessBg: wellnessData.bg,
        suggestions: wellnessData.suggestions,
        date: new Date().toISOString(),
        completed: true
      };

      if (isFirebaseConfigured && db) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all questions are answered
    const unanswered = questions.filter((_, index) => responses[index] === undefined);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} remaining.`);
      return;
    }

    handleNextTest();
  };

  const progress = ((currentTestIndex + (Object.keys(responses).length / questions.length)) / currentTestKeys.length) * 100;

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Not Found</h2>
          <p className="text-gray-600">The requested assessment type is not available.</p>
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

  // Category display names and descriptions
  const categoryDisplay = {
    stress: {
      name: 'Comprehensive Stress Assessment',
      description: 'Perceived stress, physical symptoms, generalized worry, panic symptoms, social anxiety',
      tests: ['PSS (Perceived Stress Scale – 10 items)', 'GAD-7 (Generalized Anxiety Disorder Scale – 7 items)']
    },
    depression: {
      name: 'Comprehensive Mood Assessment',
      description: 'Low mood, loss of interest, hopelessness, lack of energy, suicidal thoughts',
      tests: ['PHQ-9 (Patient Health Questionnaire – 9 items)']
    },
    confidence: {
      name: 'Self-Esteem & Control Assessment',
      description: 'Self-confidence, sense of control, motivation, persistence, resilience',
      tests: ['Rosenberg Self-Esteem Scale (RSES – 10 items)']
    },
    emotional: {
      name: 'Emotional Regulation Assessment',
      description: 'Emotional regulation, neuroticism, anger control, impulse control, social behavior',
      tests: ['DERS (Difficulties in Emotion Regulation Scale)']
    },
    decision: {
      name: 'Cognitive Assessment',
      description: 'Impulse control, risk-taking, problem-solving, attention & focus, working memory',
      tests: ['Barratt Impulsiveness Scale (BIS-11)']
    },
    social: {
      name: 'Social Skills Assessment',
      description: 'Communication, empathy, social conflict, support system, relationship quality',
      tests: ['UCLA Loneliness Scale']
    },
    sleep: {
      name: 'Sleep Quality Assessment',
      description: 'Sleep quality, difficulty falling asleep, daytime tiredness, insomnia patterns',
      tests: ['Pittsburgh Sleep Quality Index (PSQI)']
    },
    behavioral: {
      name: 'Lifestyle Assessment',
      description: 'Addictive behavior, eating habits, physical activity, screen time, work-life balance',
      tests: ['EAT-26 (Eating Attitude Test)']
    },
    digital: {
      name: 'Digital Wellness Assessment',
      description: 'Internet addiction, smartphone usage, digital wellness, technology impact on mental health',
      tests: ['Internet Addiction Test (IAT – 20 items)', 'Smartphone Addiction Scale – Short Version (SAS-SV)']
    }
  };

  const currentCategory = categoryDisplay[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-violet-100 via-purple-100 to-indigo-100 p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Test {currentTestIndex + 1} of {currentTestKeys.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">
              {currentCategory ? currentCategory.name : assessmentData.name}
            </h1>
            <p className="text-gray-600 mb-2">
              {currentCategory ? currentCategory.description : assessmentData.category + ' Assessment'}
            </p>
            <p className="text-sm text-gray-500">
              Answer each question honestly based on your recent experiences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {index + 1}. {question}
                </h3>
                <div className="space-y-3">
                  {responseOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.value}
                        checked={responses[index] === option.value}
                        onChange={() => handleResponseChange(index, option.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
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
                ) : currentTestIndex < currentTestKeys.length - 1 ? (
                  'Next Test'
                ) : (
                  'Complete Assessment'
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
