import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaChartLine, FaLightbulb, FaLink, FaCheckCircle } from 'react-icons/fa';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessment } = location.state || {};

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Assessment Data Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const { type, score, maxScore, severity, responses, suggestions, date } = assessment;
  const { ASSESSMENT_DATA } = require('../data/assessmentData');

  const assessmentData = ASSESSMENT_DATA[type.toLowerCase()];
  const questions = assessmentData ? assessmentData.questions : [];
  const responseOptions = assessmentData ? assessmentData.options : [];

  const getResponseLabel = (value) => {
    const option = responseOptions.find(opt => opt.value === value);
    return option ? option.label : `Option ${value}`;
  };

  const getSeverityColor = (severity) => {
    if (severity.includes('Minimal')) return 'text-green-600 bg-green-50';
    if (severity.includes('Mild')) return 'text-yellow-600 bg-yellow-50';
    if (severity.includes('Moderate')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScorePercentage = () => {
    return Math.round((score / maxScore) * 100);
  };

  const resources = [
    {
      title: "Mental Health America",
      url: "https://www.mha.org",
      description: "Resources and screening tools for mental health"
    },
    {
      title: "National Alliance on Mental Illness (NAMI)",
      url: "https://www.nami.org",
      description: "Support for individuals and families affected by mental illness"
    },
    {
      title: "Psychology Today - Find a Therapist",
      url: "https://www.psychologytoday.com",
      description: "Directory of mental health professionals"
    },
    {
      title: "Crisis Text Line",
      url: "https://www.crisistextline.org",
      description: "Text HOME to 741741 for 24/7 crisis support"
    }
  ];

  const handleDownloadPDF = () => {
    // Simple PDF generation using browser print
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-6"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft /> Back to Home
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaDownload /> Download PDF
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">
              Your {type} Assessment Results
            </h1>
            <p className="text-gray-600">
              Completed on {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <div className="text-center">
            <div className={`inline-block px-8 py-6 rounded-2xl ${getSeverityColor(severity)} mb-4`}>
              <div className="text-5xl font-bold mb-2">{score}/{maxScore}</div>
              <div className="text-xl font-semibold">{severity}</div>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${getScorePercentage()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{getScorePercentage()}% of maximum score</p>
            </div>
          </div>
        </motion.div>

        {/* What This Score Means */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" />
            What This Score Means
          </h2>
          <div className="prose max-w-none">
            {assessmentData ? (
              <div className="space-y-4">
                {(() => {
                  const severityInfo = assessmentData.getSeverity ? assessmentData.getSeverity(score) : { level: severity };
                  const category = assessmentData.category;

                  // Category-specific interpretations
                  switch (category) {
                    case 'Stress & Anxiety':
                      if (severityInfo.level.includes('Low') || severityInfo.level.includes('Minimal')) {
                        return (
                          <p className="text-green-700">
                            Your {assessmentData.name} score indicates you're managing stress and anxiety well.
                            Continue with healthy coping strategies like exercise, mindfulness, and maintaining social connections.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-yellow-700">
                            Your score suggests moderate stress/anxiety levels. Consider incorporating relaxation techniques,
                            professional counseling, or stress management programs into your routine.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score indicates high stress/anxiety levels. Professional help is strongly recommended.
                            Consider therapy, medication, or immediate support services.
                          </p>
                        );
                      }

                    case 'Depression & Mood Disorders':
                      if (severityInfo.level.includes('Minimal') || severityInfo.level.includes('Normal')) {
                        return (
                          <p className="text-green-700">
                            Your mood assessment indicates minimal depression symptoms. Maintain healthy habits
                            and continue monitoring your mental well-being.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Mild')) {
                        return (
                          <p className="text-yellow-700">
                            Your score suggests mild depression symptoms. Self-care strategies, exercise, and
                            social support can be helpful. Consider professional guidance if symptoms persist.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-orange-700">
                            Your score indicates moderate depression. Professional support would be beneficial.
                            Therapy and possibly medication may help manage these symptoms effectively.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-800 font-semibold">
                            Your score indicates severe depression. Seek immediate professional help.
                            Contact a mental health professional, your doctor, or emergency services if needed.
                          </p>
                        );
                      }

                    case 'Confidence & Personality Control':
                      if (severityInfo.level.includes('High') || severityInfo.level.includes('Internal')) {
                        return (
                          <p className="text-green-700">
                            Your assessment shows strong self-confidence and internal locus of control.
                            Continue building on these positive traits through personal development activities.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Normal') || severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-yellow-700">
                            Your score indicates moderate confidence levels. Consider building self-esteem through
                            positive affirmations, skill development, and supportive relationships.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score suggests low confidence and external locus of control. Professional counseling
                            focused on building self-esteem and personal empowerment would be beneficial.
                          </p>
                        );
                      }

                    case 'Emotional Stability & Personality Traits':
                      if (severityInfo.level.includes('Good') || severityInfo.level.includes('Low')) {
                        return (
                          <p className="text-green-700">
                            Your emotional regulation assessment shows good emotional stability.
                            Continue practicing healthy emotional management strategies.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-yellow-700">
                            Your score indicates moderate emotional regulation challenges. Consider learning
                            emotional regulation techniques and mindfulness practices.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score suggests significant emotional regulation difficulties. Professional therapy
                            focusing on emotional regulation skills would be highly beneficial.
                          </p>
                        );
                      }

                    case 'Decision-Making & Cognitive Functioning':
                      if (severityInfo.level.includes('Low')) {
                        return (
                          <p className="text-green-700">
                            Your cognitive assessment indicates good decision-making and cognitive functioning.
                            Continue maintaining healthy cognitive habits and mental stimulation.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-yellow-700">
                            Your score suggests moderate cognitive challenges. Consider cognitive training,
                            better sleep habits, and stress reduction techniques.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score indicates significant cognitive difficulties. Professional evaluation
                            and cognitive rehabilitation may be necessary.
                          </p>
                        );
                      }

                    case 'Social Relationships & Interpersonal Issues':
                      if (severityInfo.level.includes('Strong') || severityInfo.level.includes('Low')) {
                        return (
                          <p className="text-green-700">
                            Your social assessment shows healthy social functioning and relationships.
                            Continue nurturing your social connections and communication skills.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-yellow-700">
                            Your score indicates moderate social challenges. Consider social skills training,
                            joining support groups, or counseling focused on interpersonal relationships.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score suggests significant social difficulties. Professional help with social
                            skills development and relationship counseling would be beneficial.
                          </p>
                        );
                      }

                    case 'Sleep Issues':
                      if (severityInfo.level.includes('Good') || severityInfo.level.includes('No')) {
                        return (
                          <p className="text-green-700">
                            Your sleep assessment indicates good sleep quality. Continue maintaining healthy
                            sleep habits and routines.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Fair') || severityInfo.level.includes('Subthreshold')) {
                        return (
                          <p className="text-yellow-700">
                            Your score suggests moderate sleep difficulties. Consider improving sleep hygiene,
                            relaxation techniques, and addressing any underlying stress factors.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score indicates significant sleep problems. Professional evaluation for sleep
                            disorders and treatment may be necessary.
                          </p>
                        );
                      }

                    case 'Behavioral & Lifestyle Factors':
                      if (severityInfo.level.includes('Low')) {
                        return (
                          <p className="text-green-700">
                            Your lifestyle assessment shows healthy behavioral patterns. Continue maintaining
                            positive lifestyle choices and habits.
                          </p>
                        );
                      } else if (severityInfo.level.includes('Moderate')) {
                        return (
                          <p className="text-yellow-700">
                            Your score suggests moderate lifestyle concerns. Consider making positive changes
                            in areas like physical activity, diet, or substance use patterns.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-red-700">
                            Your score indicates significant behavioral health concerns. Professional help
                            and support services would be strongly recommended.
                          </p>
                        );
                      }

                    default:
                      return (
                        <p className="text-gray-700">
                          Your {assessmentData.name} score is {severityInfo.level}.
                          Consider discussing these results with a mental health professional for personalized guidance.
                        </p>
                      );
                  }
                })()}
              </div>
            ) : (
              <div className="space-y-4">
                {type === 'PHQ9' ? (
                  <div className="space-y-4">
                    {score <= 4 && (
                      <p className="text-green-700">
                        Your score indicates minimal symptoms of depression. You're managing well, but remember to maintain healthy habits and self-care routines.
                      </p>
                    )}
                    {score >= 5 && score <= 9 && (
                      <p className="text-yellow-700">
                        Your score suggests mild depression symptoms. While not severe, these symptoms may affect your daily life. Consider self-care strategies and monitoring your symptoms.
                      </p>
                    )}
                    {score >= 10 && score <= 14 && (
                      <p className="text-orange-700">
                        Your score indicates moderate depression. Professional support would be helpful. Consider talking to a therapist or counselor about your symptoms.
                      </p>
                    )}
                    {score >= 15 && score <= 19 && (
                      <p className="text-red-700">
                        Your score suggests moderately severe depression. You should seek professional help soon. Treatment can be very effective for managing these symptoms.
                      </p>
                    )}
                    {score >= 20 && (
                      <p className="text-red-800 font-semibold">
                        Your score indicates severe depression. Please seek immediate professional help. Contact a mental health professional, your doctor, or emergency services if needed.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {score <= 4 && (
                      <p className="text-green-700">
                        Your score indicates minimal anxiety symptoms. You're managing well, but continue practicing stress management techniques.
                      </p>
                    )}
                    {score >= 5 && score <= 9 && (
                      <p className="text-yellow-700">
                        Your score suggests mild anxiety symptoms. Consider relaxation techniques and monitoring your symptoms over time.
                      </p>
                    )}
                    {score >= 10 && score <= 14 && (
                      <p className="text-orange-700">
                        Your score indicates moderate anxiety. Professional support would be beneficial. Consider therapy or counseling.
                      </p>
                    )}
                    {score >= 15 && (
                      <p className="text-red-700">
                        Your score suggests severe anxiety. Seek professional help soon. Anxiety disorders are highly treatable with proper support.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Your Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Your Answers Breakdown
          </h2>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {index + 1}. {question}
                    </h3>
                    <p className="text-indigo-600 font-medium">
                      {getResponseLabel(responses[index] || 0)} ({responses[index] || 0} points)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What You Should Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            What You Should Do
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helpful Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaLink className="text-purple-500" />
            Helpful Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <h3 className="font-semibold text-indigo-600 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Next Steps</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                Take Another Assessment
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultsPage;
