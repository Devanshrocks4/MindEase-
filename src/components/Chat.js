import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaSmile, FaExclamationTriangle, FaUserMd } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Chat = ({ userId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm MindEase AI, your mental health companion. I'm here to listen, support, and guide you through your wellness journey. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emotionalState, setEmotionalState] = useState('neutral');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Comprehensive AI responses with advanced emotional intelligence and mental health knowledge
  const aiResponses = {
    greeting: [
      "Hello! I'm MindEase AI, your compassionate mental health companion. I'm here to listen, support, and guide you with evidence-based strategies. How are you feeling right now?",
      "Welcome to a safe space for your mental health journey. I understand that reaching out takes courage. What's on your mind today?",
      "I'm honored that you've chosen to share your thoughts with me. Every conversation is confidential and judgment-free. How can I support you today?",
      "Thank you for trusting me with your mental health journey. I'm equipped with knowledge about various mental health conditions and coping strategies. What's bringing you here today?"
    ],
    stress: [
      "Stress is a natural response to challenging situations, but chronic stress can affect your physical and mental health. Let's work together to identify your stressors and build coping strategies.",
      "I hear that stress is affecting you. The good news is that there are many effective techniques to manage stress. Would you like me to guide you through a quick stress-reduction exercise?",
      "Stress often comes from feeling overwhelmed by demands. Try this: Take a deep breath and ask yourself 'What is one small thing I can do right now?' This can help break the cycle of overwhelm.",
      "When stress builds up, it can feel like everything is urgent. Let's prioritize: What's the most important thing you're dealing with right now? We can tackle it step by step.",
      "Stress management is about balance. Are you getting enough sleep, eating well, and taking breaks? Small lifestyle changes can make a big difference in how you handle stress."
    ],
    anxiety: [
      "Anxiety is one of the most common mental health experiences, affecting millions of people worldwide. The fact that you're recognizing it shows great self-awareness.",
      "Anxiety often involves racing thoughts and physical symptoms like a fast heartbeat or tension. Let's try a grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      "Your anxious thoughts are not predictions of the future - they're just thoughts. Try this cognitive reframing: Instead of 'What if something goes wrong?', ask 'What's the evidence for and against this worry?'",
      "Anxiety can make you feel unsafe even when you are safe. This is your nervous system's way of trying to protect you, but sometimes it overreacts. Would you like to learn about anxiety management techniques?",
      "Many people with anxiety find relief through regular practice of mindfulness or meditation. Even 5 minutes a day can help rewire your brain's response to anxiety triggers."
    ],
    depression: [
      "Depression is a serious but treatable condition that affects how you feel, think, and handle daily activities. You're not alone - over 264 million people worldwide experience depression.",
      "I hear the heaviness in your words. Depression can make even small tasks feel impossible, but please know that this feeling will change. You're taking an important step by reaching out.",
      "Depression often involves changes in sleep, appetite, energy levels, and interest in activities you once enjoyed. Have you noticed any of these changes in yourself?",
      "One of the most effective treatments for depression is a combination of therapy and sometimes medication. Cognitive Behavioral Therapy (CBT) has been shown to be particularly effective.",
      "Even small acts of self-care can help when depression feels overwhelming. Have you tried going for a short walk, calling a friend, or doing something creative today?",
      "Depression can distort your thinking, making you believe you're worthless or that things will never improve. These are symptoms of depression, not truths about you."
    ],
    panic: [
      "Panic attacks can be terrifying, but they're not dangerous. They're your body's intense stress response, and there are effective ways to manage them.",
      "During a panic attack, remember: This will pass. Try this breathing technique - breathe in for 4 counts, hold for 4, breathe out for 4. Focus on your breath, not the panic.",
      "Panic attacks often involve physical symptoms like chest tightness, dizziness, or numbness. These are caused by the 'fight or flight' response and will subside.",
      "Many people find it helpful to have a 'panic plan' - a list of steps to take when panic starts. Would you like me to help you create one?",
      "Panic attacks are treatable. Therapy approaches like CBT can help you understand your triggers and develop coping strategies."
    ],
    sleep: [
      "Sleep is crucial for mental health. Poor sleep can worsen anxiety, depression, and stress. Let's work on improving your sleep hygiene.",
      "For better sleep: Keep your bedroom cool and dark, avoid screens an hour before bed, and establish a consistent sleep schedule. Even on weekends!",
      "If racing thoughts keep you awake, try writing them down before bed. Tell yourself 'I can think about this tomorrow.'",
      "Insomnia is common with mental health challenges. Cognitive Behavioral Therapy for Insomnia (CBT-I) is very effective and doesn't involve medication.",
      "Your brain processes emotions during sleep. If you're struggling with sleep, it might be related to unprocessed stress or anxiety during the day."
    ],
    relationships: [
      "Relationships can be a source of great joy and also significant stress. Healthy relationships involve mutual respect, trust, and good communication.",
      "If you're experiencing relationship difficulties, remember that it's okay to set boundaries and prioritize your mental health.",
      "Communication is key in relationships. Try using 'I' statements: 'I feel hurt when...' instead of 'You always...' This reduces defensiveness.",
      "Sometimes relationships need professional help too. Couples counseling can be very effective for working through challenges together.",
      "Your relationships should support your well-being, not diminish it. If a relationship is consistently causing distress, it may be worth evaluating."
    ],
    self_esteem: [
      "Low self-esteem often develops from negative experiences and critical self-talk. The good news is that it can be rebuilt with practice.",
      "Try this exercise: Write down three things you appreciate about yourself each day. Start small - maybe 'I brushed my teeth today' or 'I was kind to someone.'",
      "Your self-worth isn't determined by your achievements, appearance, or what others think. You have inherent value simply because you exist.",
      "Negative self-talk is a habit that can be changed. When you notice critical thoughts, ask yourself: 'Would I say this to a friend?' If not, reframe it kindly.",
      "Building self-esteem takes time and patience. Celebrate small victories and be compassionate with yourself during setbacks."
    ],
    motivation: [
      "Lack of motivation is common with mental health challenges. It's not laziness - it's often a symptom of depression, anxiety, or burnout.",
      "When motivation is low, start with the smallest possible step. Even 5 minutes of activity can create momentum.",
      "Try breaking tasks into tiny steps. Instead of 'clean the house,' start with 'put one dish away.' Small wins build confidence.",
      "Motivation often returns after you start. The hardest part is beginning. Once you take that first step, it gets easier.",
      "Be kind to yourself about motivation fluctuations. Some days will be easier than others, and that's normal."
    ],
    grief: [
      "Grief is a natural response to loss, and there's no 'right' way to grieve. Your feelings are valid, whatever they are.",
      "Grief can involve many emotions: sadness, anger, guilt, confusion. All of these are normal parts of the grieving process.",
      "Grief doesn't follow a linear path. You might feel better for a while, then have a setback. This is normal.",
      "It's important to allow yourself time to grieve. Pushing away grief often makes it stronger later.",
      "Grieving is hard work. Be gentle with yourself and seek support from others who care about you."
    ],
    trauma: [
      "Trauma can affect how you feel, think, and relate to others. Healing from trauma is possible, though it takes time and often professional support.",
      "Your nervous system may still be responding to past threats. This is why certain triggers can feel so intense.",
      "Trauma healing often involves feeling safe enough to process what happened. Therapy approaches like EMDR or trauma-focused CBT can be very helpful.",
      "You survived the trauma, and that's a testament to your strength. Healing is about reclaiming your sense of safety and control.",
      "If you're experiencing trauma symptoms, professional help is strongly recommended. There are specialists who understand how to help."
    ],
    suicidal: [
      "I'm deeply concerned about what you're sharing. Your life has value, and there are people who care about you and want to help.",
      "Please reach out for immediate help. In India, call the Mental Health Helpline at 1800-121-4555, or contact emergency services at 112.",
      "Suicidal thoughts are serious and require professional intervention. You're not alone - many people experience these thoughts and recover.",
      "If you're in immediate danger, please go to the nearest emergency room or call emergency services right now.",
      "There are crisis counselors available 24/7 who are trained to help in these situations. Please don't hesitate to reach out to them."
    ],
    coping_strategies: [
      "Here are some evidence-based coping strategies: 1) Deep breathing exercises, 2) Progressive muscle relaxation, 3) Mindfulness meditation, 4) Physical activity, 5) Journaling your thoughts.",
      "For immediate relief: Try the 5-4-3-2-1 grounding technique - notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      "Cognitive reframing: When you have a negative thought, ask yourself: 'Is this thought 100% true? What's the evidence for and against it?'",
      "Self-compassion exercise: Treat yourself like you would treat a dear friend. What would you say to comfort them?",
      "Problem-solving: Break big problems into smaller steps. What is one action you can take today, no matter how small?"
    ],
    professional_help: [
      "Based on what you've shared, I strongly recommend speaking with a mental health professional. They can provide personalized assessment and treatment.",
      "Professional help can include therapy, counseling, psychiatry, or a combination. Each has different benefits depending on your needs.",
      "In India, you can access mental health services through government hospitals, private clinics, or organizations like MindEase counselors.",
      "Many people find that therapy provides tools and insights they couldn't develop alone. It's a sign of strength to seek professional support.",
      "If cost is a concern, there are low-cost or free mental health services available. I can help you find resources in your area."
    ],
    medication: [
      "Medication can be a helpful part of treatment for many mental health conditions, but it's most effective when combined with therapy.",
      "Antidepressants, anti-anxiety medications, and mood stabilizers are commonly prescribed. Each works differently and has different side effects.",
      "Medication decisions should be made with a psychiatrist who can consider your specific symptoms, medical history, and preferences.",
      "Some people prefer therapy alone, while others benefit from medication. There's no 'one size fits all' approach.",
      "If you're considering medication, please consult a psychiatrist rather than starting or stopping medications on your own."
    ],
    mindfulness: [
      "Mindfulness is about being present in the moment without judgment. It can help reduce anxiety and improve emotional regulation.",
      "Try this simple mindfulness exercise: Focus on your breath for 1 minute. When your mind wanders, gently bring it back to your breath.",
      "Mindfulness apps like Headspace or Calm can be great tools for beginners. They offer guided meditations for various situations.",
      "Regular mindfulness practice can actually change your brain structure, strengthening areas related to emotional regulation.",
      "You don't need to meditate for hours. Even 5 minutes a day can make a difference over time."
    ],
    exercise: [
      "Exercise is one of the most effective natural antidepressants. Even 10 minutes of walking can improve your mood.",
      "Physical activity releases endorphins, which are natural mood boosters. It also reduces stress hormones like cortisol.",
      "Find an activity you enjoy - walking, dancing, yoga, swimming. The key is consistency, not intensity.",
      "Exercise can help with sleep, energy levels, and self-esteem. It's a powerful tool for mental health.",
      "If you're not currently active, start small. Even a 5-minute walk around the block is a victory."
    ],
    nutrition: [
      "Nutrition affects mental health in important ways. A balanced diet supports brain function and mood regulation.",
      "Foods rich in omega-3 fatty acids (like salmon, walnuts, flaxseeds) may help reduce depression symptoms.",
      "Blood sugar stability is important for mood. Eating regular, balanced meals can prevent mood swings.",
      "Some people find that reducing caffeine and sugar helps with anxiety and sleep. Pay attention to how different foods affect you.",
      "Stay hydrated! Dehydration can affect concentration, energy levels, and mood."
    ],
    social_support: [
      "Social connections are crucial for mental health. Humans are social beings, and isolation can worsen mental health challenges.",
      "Reach out to trusted friends or family members. Sometimes just saying 'I'm struggling' can open the door to support.",
      "Consider joining support groups for people with similar experiences. Sharing with others who understand can be very healing.",
      "If your social circle is limited, consider volunteering, joining clubs, or taking classes to meet new people.",
      "Quality matters more than quantity in social connections. One or two deep, supportive relationships can make a big difference."
    ],
    work_stress: [
      "Work-related stress is very common. Many people experience it, but there are ways to manage it effectively.",
      "Set boundaries between work and personal time. Try not checking work emails after a certain hour.",
      "Practice the 'one thing' rule: When overwhelmed, ask yourself 'What is the one most important thing I need to focus on right now?'",
      "If work stress is chronic, it may be worth discussing with your supervisor or HR about workload adjustments.",
      "Remember that your well-being is more important than any job. Taking care of yourself enables you to perform better at work."
    ],
    general_support: [
      "I'm here to listen and support you. What's been most challenging for you lately?",
      "Your feelings are valid, and it's okay to struggle sometimes. Many people do.",
      "You're taking positive steps by reaching out. That's something to be proud of.",
      "Mental health challenges don't define you. They're just experiences you're having, and they can change.",
      "What would be most helpful for you right now? More information, coping strategies, or just someone to listen?"
    ]
  };

  // Analyze emotional state and provide appropriate responses
  const analyzeEmotionalState = (message) => {
    const text = message.toLowerCase();
    let state = 'neutral';
    let severity = 'low';

    // High-risk keywords - immediate crisis intervention needed
    const highRiskKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
      'want to die', 'end my life', 'no reason to live', 'should kill myself'
    ];
    if (highRiskKeywords.some(keyword => text.includes(keyword))) {
      state = 'crisis';
      severity = 'critical';
    }

    // Depression indicators - high priority
    const depressionKeywords = [
      'depressed', 'hopeless', 'worthless', 'no point', 'give up', 'tired of living',
      'empty', 'numb', 'meaningless', 'pointless', 'don\'t care anymore', 'nothing matters'
    ];
    if (depressionKeywords.some(keyword => text.includes(keyword))) {
      state = 'depression';
      severity = 'high';
    }

    // Anxiety and panic indicators - medium priority
    const anxietyKeywords = [
      'anxious', 'panic', 'panicking', 'worried', 'worry', 'nervous', 'scared',
      'fear', 'frightened', 'overwhelmed', 'overwhelming', 'heart racing',
      'chest tight', 'dizzy', 'trembling', 'shaking', 'sweating'
    ];
    if (anxietyKeywords.some(keyword => text.includes(keyword))) {
      state = 'anxiety';
      severity = 'medium';
    }

    // Stress indicators - medium priority
    const stressKeywords = [
      'stressed', 'stress', 'pressure', 'pressured', 'overwhelm', 'overwhelmed',
      'burnout', 'burnt out', 'exhausted', 'tired', 'drained', 'overloaded'
    ];
    if (stressKeywords.some(keyword => text.includes(keyword))) {
      state = 'stress';
      severity = 'medium';
    }

    // Additional emotional states
    const griefKeywords = ['grief', 'loss', 'bereavement', 'mourning', 'died', 'death', 'passed away', 'missing'];
    if (griefKeywords.some(keyword => text.includes(keyword))) {
      state = 'grief';
      severity = 'medium';
    }

    const traumaKeywords = ['trauma', 'traumatic', 'abuse', 'assault', 'ptsd', 'flashbacks', 'triggers'];
    if (traumaKeywords.some(keyword => text.includes(keyword))) {
      state = 'trauma';
      severity = 'high';
    }

    return { state, severity };
  };

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const analysis = analyzeEmotionalState(message);
    setEmotionalState(analysis.state);

    // Crisis response takes priority
    if (analysis.state === 'crisis') {
      return aiResponses.suicidal[Math.floor(Math.random() * aiResponses.suicidal.length)];
    }

    // Professional help recommendation for high severity
    if (analysis.severity === 'high' && Math.random() > 0.5) {
      return aiResponses.professional_help[Math.floor(Math.random() * aiResponses.professional_help.length)];
    }

    // Enhanced keyword matching for better response selection
    const keywords = {
      greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you', 'how do you do', 'nice to meet you', 'what\'s up', 'sup', 'yo', 'greetings', 'salutations'],
      stress: ['stress', 'stressed', 'overwhelm', 'overwhelmed', 'pressure', 'pressured', 'burnout', 'burnt out'],
      anxiety: ['anxiety', 'anxious', 'panic', 'panicking', 'worried', 'worry', 'nervous', 'scared', 'fear', 'frightened'],
      depression: ['depress', 'depressed', 'sad', 'down', 'hopeless', 'worthless', 'empty', 'numb'],
      sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'rest', 'bed', 'wake', 'nightmare'],
      relationships: ['relationship', 'partner', 'friend', 'family', 'love', 'breakup', 'divorce', 'conflict'],
      self_esteem: ['self-esteem', 'confidence', 'worth', 'value', 'insecure', 'doubt', 'criticism'],
      motivation: ['motivation', 'motivated', 'lazy', 'procrastinate', 'goal', 'achievement', 'success'],
      grief: ['grief', 'loss', 'bereavement', 'mourning', 'died', 'death', 'passed away', 'missing'],
      trauma: ['trauma', 'traumatic', 'abuse', 'assault', 'ptsd', 'flashback', 'trigger'],
      mindfulness: ['mindfulness', 'meditation', 'mindful', 'present', 'aware', 'conscious'],
      exercise: ['exercise', 'workout', 'run', 'walk', 'gym', 'fitness', 'physical', 'active'],
      nutrition: ['food', 'eat', 'diet', 'nutrition', 'meal', 'hungry', 'appetite', 'weight'],
      work_stress: ['work', 'job', 'career', 'boss', 'colleague', 'office', 'deadline', 'meeting'],
      coping: ['cope', 'manage', 'deal', 'handle', 'strategy', 'technique', 'skill'],
      help: ['help', 'support', 'talk', 'listen', 'advice', 'guidance', 'assist']
    };

    // Check for multiple keyword matches and prioritize
    let bestMatch = 'general_support';
    let maxMatches = 0;

    Object.entries(keywords).forEach(([category, words]) => {
      const matches = words.filter(word => message.includes(word)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = category;
      }
    });

    // Return appropriate response based on best match
    switch (bestMatch) {
      case 'greeting':
        return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
      case 'stress':
        return aiResponses.stress[Math.floor(Math.random() * aiResponses.stress.length)];
      case 'anxiety':
        return aiResponses.anxiety[Math.floor(Math.random() * aiResponses.anxiety.length)];
      case 'depression':
        return aiResponses.depression[Math.floor(Math.random() * aiResponses.depression.length)];
      case 'sleep':
        return aiResponses.sleep[Math.floor(Math.random() * aiResponses.sleep.length)];
      case 'relationships':
        return aiResponses.relationships[Math.floor(Math.random() * aiResponses.relationships.length)];
      case 'self_esteem':
        return aiResponses.self_esteem[Math.floor(Math.random() * aiResponses.self_esteem.length)];
      case 'motivation':
        return aiResponses.motivation[Math.floor(Math.random() * aiResponses.motivation.length)];
      case 'grief':
        return aiResponses.grief[Math.floor(Math.random() * aiResponses.grief.length)];
      case 'trauma':
        return aiResponses.trauma[Math.floor(Math.random() * aiResponses.trauma.length)];
      case 'mindfulness':
        return aiResponses.mindfulness[Math.floor(Math.random() * aiResponses.mindfulness.length)];
      case 'exercise':
        return aiResponses.exercise[Math.floor(Math.random() * aiResponses.exercise.length)];
      case 'nutrition':
        return aiResponses.nutrition[Math.floor(Math.random() * aiResponses.nutrition.length)];
      case 'work_stress':
        return aiResponses.work_stress[Math.floor(Math.random() * aiResponses.work_stress.length)];
      case 'coping':
        return aiResponses.coping_strategies[Math.floor(Math.random() * aiResponses.coping_strategies.length)];
      case 'help':
        return aiResponses.professional_help[Math.floor(Math.random() * aiResponses.professional_help.length)];
      default:
        return aiResponses.general_support[Math.floor(Math.random() * aiResponses.general_support.length)];
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'user'
      };
      setMessages([...messages, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate AI thinking and response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          text: getAIResponse(newMessage),
          sender: 'ai',
          timestamp: new Date(),
          type: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const suggestProfessionalHelp = () => {
    navigate('/counselors');
  };

  const emojis = ['😊', '❤️', '👍', '🙏', '💪', '🌟', '🧘', '📖', '🎵', '🌱', '☀️', '🌙'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-lime-100 via-green-100 to-emerald-100 p-6"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 font-poppins text-center">AI Mental Health Companion</h1>
        <p className="text-gray-600 mb-8 text-center">Connect with MindEase AI. All conversations are private and supportive.</p>

        {/* Emotional State Indicator */}
        {emotionalState !== 'neutral' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-4 p-3 rounded-lg text-center ${
              emotionalState === 'crisis' ? 'bg-red-100 border border-red-300' :
              emotionalState === 'depression' ? 'bg-blue-100 border border-blue-300' :
              emotionalState === 'anxiety' ? 'bg-yellow-100 border border-yellow-300' :
              'bg-orange-100 border border-orange-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FaExclamationTriangle className={`text-lg ${
                emotionalState === 'crisis' ? 'text-red-600' :
                emotionalState === 'depression' ? 'text-blue-600' :
                emotionalState === 'anxiety' ? 'text-yellow-600' :
                'text-orange-600'
              }`} />
              <span className={`font-medium ${
                emotionalState === 'crisis' ? 'text-red-800' :
                emotionalState === 'depression' ? 'text-blue-800' :
                emotionalState === 'anxiety' ? 'text-yellow-800' :
                'text-orange-800'
              }`}>
                {emotionalState === 'crisis' ? 'I sense you may be in crisis' :
                 emotionalState === 'depression' ? 'I notice signs of depression' :
                 emotionalState === 'anxiety' ? 'I detect anxiety indicators' :
                 'I sense you may need additional support'}
              </span>
            </div>
            <button
              onClick={suggestProfessionalHelp}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <FaUserMd /> Get Professional Help
            </button>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaRobot className="text-indigo-600 text-sm" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-800 border border-indigo-100'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaRobot className="text-indigo-600 text-sm" />
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-800 border border-indigo-100 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  <FaSmile />
                </button>
              </div>
              <motion.button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPaperPlane className="text-sm" />
              </motion.button>
            </div>

            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-2 bg-gray-50 rounded-lg border"
              >
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl hover:bg-gray-200 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {currentUser ? `Welcome, ${currentUser.displayName || currentUser.email}!` : `Anonymous User: ${userId}`}
          </p>
        <p className="text-xs text-gray-400 mb-2">
            💡 Try mentioning words like "stress", "anxiety", "depression", "sleep", "relationships", "motivation", "grief", "trauma", "exercise", "meditation", or "help" for tailored responses.
          </p>
          <p className="text-xs text-gray-400 mb-4">
            For urgent situations, please contact emergency services or a crisis hotline.
          </p>
          <p className="text-xs text-gray-500">
            Made by KeenCoders
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
