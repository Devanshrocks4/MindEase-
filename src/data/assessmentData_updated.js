// Comprehensive assessment data for all mental health tests

export const ASSESSMENT_DATA = {
  // 1. Stress & Anxiety
  pss: {
    name: 'Perceived Stress Scale (PSS)',
    category: 'Stress & Anxiety',
    questions: [
      "In the last month, how often have you been upset because of something that happened unexpectedly?",
      "In the last month, how often have you felt that you were unable to control the important things in your life?",
      "In the last month, how often have you felt nervous and 'stressed'?",
      "In the last month, how often have you felt confident about your ability to handle your personal problems?",
      "In the last month, how often have you felt that things were going your way?",
      "In the last month, how often have you found that you could not cope with all the things that you had to do?",
      "In the last month, how often have you been able to control irritations in your life?",
      "In the last month, how often have you felt that you were on top of things?",
      "In the last month, how often have you been angered because of things that were outside of your control?",
      "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
    ],
    options: [
      { value: 0, label: "Never", points: 0 },
      { value: 1, label: "Almost Never", points: 1 },
      { value: 2, label: "Sometimes", points: 2 },
      { value: 3, label: "Fairly Often", points: 3 },
      { value: 4, label: "Very Often", points: 4 }
    ],
    reverseScored: [3, 4, 6, 7], // Questions that need reverse scoring
    maxScore: 40,
    getSeverity: (score) => {
      if (score <= 13) return { level: 'Low Stress', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 26) return { level: 'Moderate Stress', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Stress', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  gad7: {
    name: 'Generalized Anxiety Disorder Scale (GAD-7)',
    category: 'Stress & Anxiety',
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it's hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen"
    ],
    options: [
      { value: 0, label: "Not at all", points: 0 },
      { value: 1, label: "Several days", points: 1 },
      { value: 2, label: "More than half the days", points: 2 },
      { value: 3, label: "Nearly every day", points: 3 }
    ],
    maxScore: 21,
    getSeverity: (score) => {
      if (score <= 4) return { level: 'Minimal Anxiety', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 9) return { level: 'Mild Anxiety', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 14) return { level: 'Moderate Anxiety', color: 'text-orange-600', bg: 'bg-orange-50' };
      return { level: 'Severe Anxiety', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  lsas: {
    name: 'Liebowitz Social Anxiety Scale (LSAS)',
    category: 'Stress & Anxiety',
    questions: [
      "Telephone conversations (not calling in sick)",
      "Participating in small groups",
      "Eating in public places",
      "Drinking with others in public places",
      "Talking to people in authority",
      "Acting, performing or giving a talk in front of an audience",
      "Going to a party",
      "Working while being observed",
      "Writing while being observed",
      "Calling someone you don't know very well",
      "Talking with people you don't know very well",
      "Meeting strangers",
      "Urinating in a public bathroom",
      "Entering a room when others are already seated",
      "Being the center of attention",
      "Speaking up at a meeting",
      "Taking a test",
      "Expressing a disagreement or disapproval to people you don't know very well",
      "Looking at people you don't know very well in the eyes",
      "Giving a report to a group",
      "Trying to pick up someone",
      "Returning goods to a store",
      "Giving a party",
      "Resisting a high pressure salesperson"
    ],
    options: [
      { value: 0, label: "No fear or anxiety", points: 0 },
      { value: 1, label: "Mild fear/anxiety", points: 1 },
      { value: 2, label: "Moderate fear/anxiety", points: 2 },
      { value: 3, label: "Severe fear/anxiety", points: 3 }
    ],
    maxScore: 144,
    getSeverity: (score) => {
      if (score <= 30) return { level: 'Minimal Social Anxiety', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 60) return { level: 'Mild Social Anxiety', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 90) return { level: 'Moderate Social Anxiety', color: 'text-orange-600', bg: 'bg-orange-50' };
      return { level: 'Severe Social Anxiety', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  dass21_stress: {
    name: 'DASS-21 Stress Subscale',
    category: 'Stress & Anxiety',
    questions: [
      "I found it hard to wind down",
      "I was aware of dryness of my mouth",
      "I couldn't seem to experience any positive feeling at all",
      "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
      "I found it difficult to work up the initiative to do things",
      "I tended to over-react to situations",
      "I experienced trembling (e.g., in the hands)"
    ],
    options: [
      { value: 0, label: "Did not apply to me at all", points: 0 },
      { value: 1, label: "Applied to me to some degree, or some of the time", points: 1 },
      { value: 2, label: "Applied to me to a considerable degree, or a good part of time", points: 2 },
      { value: 3, label: "Applied to me very much, or most of the time", points: 3 }
    ],
    maxScore: 21,
    getSeverity: (score) => {
      if (score <= 7) return { level: 'Normal Stress', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 10) return { level: 'Mild Stress', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 14) return { level: 'Moderate Stress', color: 'text-orange-600', bg: 'bg-orange-50' };
      return { level: 'Severe Stress', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 2. Depression & Mood Disorders
  phq9: {
    name: 'Patient Health Questionnaire (PHQ-9)',
    category: 'Depression & Mood Disorders',
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself"
    ],
    options: [
      { value: 0, label: "Not at all", points: 0 },
      { value: 1, label: "Several days", points: 1 },
      { value: 2, label: "More than half the days", points: 2 },
      { value: 3, label: "Nearly every day", points: 3 }
    ],
    maxScore: 27,
    getSeverity: (score) => {
      if (score <= 4) return { level: 'Minimal Depression', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 9) return { level: 'Mild Depression', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 14) return { level: 'Moderate Depression', color: 'text-orange-600', bg: 'bg-orange-50' };
      if (score <= 19) return { level: 'Moderately Severe Depression', color: 'text-red-600', bg: 'bg-red-50' };
      return { level: 'Severe Depression', color: 'text-red-700', bg: 'bg-red-100' };
    }
  },

  dass21_depression: {
    name: 'DASS-21 Depression Subscale',
    category: 'Depression & Mood Disorders',
    questions: [
      "I couldn't seem to experience any positive feeling at all",
      "I found it difficult to work up the initiative to do things",
      "I felt that I had nothing to look forward to",
      "I felt down-hearted and blue",
      "I was unable to become enthusiastic about anything",
      "I felt I wasn't worth much as a person",
      "I felt that life was meaningless"
    ],
    options: [
      { value: 0, label: "Did not apply to me at all", points: 0 },
      { value: 1, label: "Applied to me to some degree, or some of the time", points: 1 },
      { value: 2, label: "Applied to me to a considerable degree, or a good part of time", points: 2 },
      { value: 3, label: "Applied to me very much, or most of the time", points: 3 }
    ],
    maxScore: 21,
    getSeverity: (score) => {
      if (score <= 4) return { level: 'Normal Mood', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 6) return { level: 'Mild Depression', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 10) return { level: 'Moderate Depression', color: 'text-orange-600', bg: 'bg-orange-50' };
      return { level: 'Severe Depression', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  mdq: {
    name: 'Mood Disorders Questionnaire (MDQ)',
    category: 'Depression & Mood Disorders',
    questions: [
      "Has there ever been a period of time when you were not your usual self and...",
      "...you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?",
      "...you were so irritable that you shouted at people or started fights or arguments?",
      "...you felt much more self-confident than usual?",
      "...you got much less sleep than usual and found you didn't really miss it?",
      "...you were much more talkative or spoke much faster than usual?",
      "...thoughts raced through your head or you couldn't slow your mind down?",
      "...you were so easily distracted by things around you that you had trouble concentrating or staying on track?",
      "...you had much more energy than usual?",
      "...you were much more active or did many more things than usual?",
      "...you were much more social or outgoing than usual; for example, you telephoned friends in the middle of the night?",
      "...you were much more interested in sex than usual?",
      "...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?",
      "...spending money got you or your family in trouble?"
    ],
    options: [
      { value: 0, label: "No", points: 0 },
      { value: 1, label: "Yes", points: 1 }
    ],
    maxScore: 13, // Excluding the first question which is screening
    getSeverity: (score) => {
      if (score <= 6) return { level: 'Low Bipolar Risk', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 10) return { level: 'Moderate Bipolar Risk', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Bipolar Risk', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 3. Confidence & Personality Control
  rotter: {
    name: 'Rotter\'s Locus of Control Scale',
    category: 'Confidence & Personality Control',
    questions: [
      "Children get into trouble because their parents punish them too much.",
      "The idea that teachers are unfair to students is nonsense.",
      "Success is a matter of hard work; luck has little or nothing to do with it.",
      "I have often found that what is going to happen will happen.",
      "Trusting to fate has never turned out as well for me as making a decision to take a definite course of action.",
      "In the long run the bad things that happen to us are balanced by the good ones.",
      "It is impossible for me to believe that chance or luck plays an important role in my life.",
      "People are lonely because they don't try to be friendly.",
      "What happens to me is my own doing.",
      "In my case getting what I want has little or nothing to do with luck."
    ],
    options: [
      { value: 0, label: "Strongly Disagree", points: 0 },
      { value: 1, label: "Disagree", points: 1 },
      { value: 2, label: "Agree", points: 2 },
      { value: 3, label: "Strongly Agree", points: 3 }
    ],
    reverseScored: [0, 1, 3, 5, 6, 7, 8, 9], // External locus items
    maxScore: 30,
    getSeverity: (score) => {
      if (score <= 10) return { level: 'Internal Locus of Control', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 20) return { level: 'Mixed Locus of Control', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'External Locus of Control', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  rses: {
    name: 'Rosenberg Self-Esteem Scale (RSES)',
    category: 'Confidence & Personality Control',
    questions: [
      "On the whole, I am satisfied with myself.",
      "At times, I think I am no good at all.",
      "I feel that I have a number of good qualities.",
      "I am able to do things as well as most other people.",
      "I feel I do not have much to be proud of.",
      "I certainly feel useless at times.",
      "I feel that I'm a person of worth, at least on an equal plane with others.",
      "I wish I could have more respect for myself.",
      "All in all, I am inclined to feel that I am a failure.",
      "I take a positive attitude toward myself."
    ],
    options: [
      { value: 0, label: "Strongly Disagree", points: 0 },
      { value: 1, label: "Disagree", points: 1 },
      { value: 2, label: "Agree", points: 2 },
      { value: 3, label: "Strongly Agree", points: 3 }
    ],
    reverseScored: [1, 4, 5, 7, 8], // Negative items
    maxScore: 30,
    getSeverity: (score) => {
      if (score >= 25) return { level: 'High Self-Esteem', color: 'text-green-600', bg: 'bg-green-50' };
      if (score >= 15) return { level: 'Normal Self-Esteem', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Low Self-Esteem', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  brs: {
    name: 'Brief Resilience Scale (BRS)',
    category: 'Confidence & Personality Control',
    questions: [
      "I tend to bounce back quickly after hard times.",
      "I have a hard time making it through stressful events.",
      "It does not take me long to recover from a stressful event.",
      "It is hard for me to snap back when something bad happens.",
      "I usually come through difficult times with little trouble.",
      "I tend to take a long time to get over set-backs in my life."
    ],
    options: [
      { value: 0, label: "Strongly Disagree", points: 1 },
      { value: 1, label: "Disagree", points: 2 },
      { value: 2, label: "Neutral", points: 3 },
      { value: 3, label: "Agree", points: 4 },
      { value: 4, label: "Strongly Agree", points: 5 }
    ],
    reverseScored: [1, 3, 5], // Negative items
    maxScore: 30,
    getSeverity: (score) => {
      const avgScore = score / 6;
      if (avgScore >= 4.0) return { level: 'High Resilience', color: 'text-green-600', bg: 'bg-green-50' };
      if (avgScore >= 3.0) return { level: 'Normal Resilience', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Low Resilience', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  gses: {
    name: 'General Self-Efficacy Scale (GSES)',
    category: 'Confidence & Personality Control',
    questions: [
      "I can always manage to solve difficult problems if I try hard enough.",
      "If someone opposes me, I can find the means and ways to get what I want.",
      "It is easy for me to stick to my aims and accomplish my goals.",
      "I am confident that I could deal efficiently with unexpected events.",
      "Thanks to my resourcefulness, I know how to handle unforeseen situations.",
      "I can solve most problems if I invest the necessary effort.",
      "I can remain calm when facing difficulties because I can rely on my coping abilities.",
      "When I am confronted with a problem, I can usually find several solutions.",
      "If I am in trouble, I can usually think of a solution.",
      "I can usually handle whatever comes my way."
    ],
    options: [
      { value: 0, label: "Not at all true", points: 1 },
      { value: 1, label: "Hardly true", points: 2 },
      { value: 2, label: "Moderately true", points: 3 },
      { value: 3, label: "Exactly true", points: 4 }
    ],
    maxScore: 40,
    getSeverity: (score) => {
      if (score >= 32) return { level: 'High Self-Efficacy', color: 'text-green-600', bg: 'bg-green-50' };
      if (score >= 24) return { level: 'Moderate Self-Efficacy', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Low Self-Efficacy', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 4. Emotional Stability & Personality Traits
  neo_neuroticism: {
    name: 'NEO-PI-R Neuroticism Subscale',
    category: 'Emotional Stability & Personality Traits',
    questions: [
      "I often feel tense and jittery.",
      "I worry too much over something that really doesn't matter.",
      "I am often in a bad mood.",
      "I get upset easily.",
      "I am easily frightened.",
      "I often feel inferior to others.",
      "I am easily discouraged.",
      "I am often anxious for no good reason."
    ],
    options: [
      { value: 0, label: "Strongly Disagree", points: 0 },
      { value: 1, label: "Disagree", points: 1 },
      { value: 2, label: "Neutral", points: 2 },
      { value: 3, label: "Agree", points: 3 },
      { value: 4, label: "Strongly Agree", points: 4 }
    ],
    maxScore: 32,
    getSeverity: (score) => {
      if (score <= 12) return { level: 'Low Neuroticism', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 20) return { level: 'Moderate Neuroticism', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Neuroticism', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  ders: {
    name: 'Difficulties in Emotion Regulation Scale (DERS)',
    category: 'Emotional Stability & Personality Traits',
    questions: [
      "I am clear about my feelings.",
      "I pay attention to how I feel.",
      "I experience my emotions as overwhelming and out of control.",
      "I have no idea how I am feeling.",
      "I have difficulty making sense out of my feelings.",
      "I am attentive to my feelings.",
      "I know exactly how I am feeling.",
      "I care about what I am feeling.",
      "I am confused about how I feel.",
      "When I am upset, I acknowledge my emotions.",
      "When I am upset, I become angry with myself for feeling that way.",
      "When I am upset, I become embarrassed for feeling that way.",
      "When I am upset, I have difficulty getting work done.",
      "When I am upset, I become out of control.",
      "When I am upset, I believe that I will remain that way for a long time.",
      "When I am upset, I believe that I'll end up doing something I regret.",
      "When I am upset, I have difficulty focusing on other things.",
      "When I am upset, I feel out of control.",
      "When I am upset, I have difficulty concentrating.",
      "When I am upset, I have difficulty controlling my behaviors.",
      "When I am upset, I believe that there is nothing I can do to make myself feel better.",
      "When I am upset, I lose control over my behaviors.",
      "When I am upset, I have difficulty returning to normal.",
      "When I am upset, my emotions feel overwhelming.",
      "When I am upset, I can't prevent myself from doing things I shouldn't do.",
      "When I am upset, I feel guilty for feeling that way.",
      "When I am upset, I feel ashamed for feeling that way.",
      "When I am upset, I believe my emotions are valid and important.",
      "When I am upset, I become irritated with myself for feeling that way.",
      "When I am upset, I start to feel very bad about myself.",
      "When I am upset, I believe that most people would be able to control their emotions better than I can.",
      "When I am upset, I believe that I am weak for feeling that way.",
      "When I am upset, I have difficulty calming down.",
      "When I am upset, I know that I can find a way to eventually feel better.",
      "When I am upset, I can find a way to feel better.",
      "When I am upset, I can change the way I feel.",
      "When I am upset, I believe that I can influence my emotions."
    ],
    options: [
      { value: 0, label: "Almost Never (0-10%)", points: 1 },
      { value: 1, label: "Sometimes (11-35%)", points: 2 },
      { value: 2, label: "About Half the Time (36-65%)", points: 3 },
      { value: 3, label: "Most of the Time (66-90%)", points: 4 },
      { value: 4, label: "Almost Always (91-100%)", points: 5 }
    ],
    reverseScored: [0, 1, 5, 6, 7, 9, 27, 32, 33, 34, 35], // Positive items
    maxScore: 180,
    getSeverity: (score) => {
      const avgScore = score / 36;
      if (avgScore <= 2.5) return { level: 'Good Emotion Regulation', color: 'text-green-600', bg: 'bg-green-50' };
      if (avgScore <= 3.5) return { level: 'Moderate Emotion Regulation', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Poor Emotion Regulation', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  staxi: {
    name: 'State-Trait Anger Expression Inventory (STAXI-2)',
    category: 'Emotional Stability & Personality Traits',
    questions: [
      "I am quick tempered.",
      "I have a fiery temper.",
      "I am a hotheaded person.",
      "I get angry when I'm slowed down by others' mistakes.",
      "I feel annoyed when I am not given recognition for doing good work.",
      "I fly off the handle.",
      "When I get mad, I say nasty things.",
      "When I get frustrated, I feel like hitting someone.",
      "I feel like swearing when I get angry.",
      "I stomp away or slam doors when I get angry."
    ],
    options: [
      { value: 0, label: "Almost Never", points: 1 },
      { value: 1, label: "Sometimes", points: 2 },
      { value: 2, label: "Often", points: 3 },
      { value: 3, label: "Almost Always", points: 4 }
    ],
    maxScore: 40,
    getSeverity: (score) => {
      if (score <= 15) return { level: 'Low Anger Expression', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 25) return { level: 'Moderate Anger Expression', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Anger Expression', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 5. Decision-Making & Cognitive Functioning
  bis11: {
    name: 'Barratt Impulsiveness Scale (BIS-11)',
    category: 'Decision-Making & Cognitive Functioning',
    questions: [
      "I plan tasks carefully.",
      "I do things without thinking.",
      "I make-up my mind quickly.",
      "I am happy-go-lucky.",
      "I don't \"pay attention\".",
      "I have \"racing\" thoughts.",
      "I plan for job security.",
      "I say things without thinking.",
      "I like to think about complex problems.",
      "I change jobs.",
      "I act on impulse.",
      "I get easily bored when solving thought problems.",
      "I act on the spur of the moment.",
      "I am a careful thinker.",
      "I plan trips well ahead of time.",
      "I am self controlled.",
      "I concentrate easily.",
      "I save regularly.",
      "I \"squirm\" at plays or lectures.",
      "I am a steady thinker.",
      "I change residences.",
      "I buy things on impulse.",
      "I can only think about one thing at a time.",
      "I change hobbies.",
      "I spend or charge more than I earn.",
      "I often have extraneous thoughts when thinking.",
      "I am more interested in the present than the future.",
      "I am restless at the theater or lectures.",
      "I like puzzles.",
      "I am future oriented."
    ],
    options: [
      { value: 0, label: "Rarely/Never", points: 1 },
      { value: 1, label: "Occasionally", points: 2 },
      { value: 2, label: "Often", points: 3 },
      { value: 3, label: "Almost Always/Always", points: 4 }
    ],
    reverseScored: [0, 6, 8, 9, 13, 14, 15, 16, 17, 19, 28, 29], // Non-impulsive items
    maxScore: 120,
    getSeverity: (score) => {
      if (score <= 60) return { level: 'Low Impulsivity', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 80) return { level: 'Moderate Impulsivity', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Impulsivity', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  cfq: {
    name: 'Cognitive Failures Questionnaire (CFQ)',
    category: 'Decision-Making & Cognitive Functioning',
    questions: [
      "Do you read something and find you haven't been thinking about it and must read it again?",
      "Do you find you forget why you went from one part of the house to the other?",
      "Do you fail to notice signposts on the road?",
      "Do you find you confuse right and left when giving directions?",
      "Do you bump into people?",
      "Do you find you forget whether you've turned off a light or a fire or locked the door?",
      "Do you fail to listen to people's names when you are meeting them?",
      "Do you say something and realize afterwards that it might be taken as insulting?",
      "Do you fail to see what you want in a supermarket (although it's there)?",
      "Do you find yourself suddenly wondering whether you've used a word correctly?",
      "Do you have trouble making up your mind?",
      "Do you find you forget what you came to the shops to buy?",
      "Do you drop things?",
      "Do you find you can't quite remember something although it's \"on the tip of your tongue\"?",
      "Do you find you forget appointments?",
      "Do you forget where you put something like a newspaper or a book?",
      "Do you start doing one thing at home and get distracted into doing something else (unintentionally)?",
      "Do you find you can't think of anything to say?",
      "Do you forget what you planned to do when you get to the store?",
      "Do you lose your temper and regret it?",
      "Do you leave important letters unanswered for days?",
      "Do you find you overlook details in a job or task you are given to do?",
      "Do you find you can't remember the way to a place you've visited before?",
      "Do you find you can't remember the name of a person you have just met?",
      "Do you find you can't remember the way to a place you've visited before?",
      "Do you find you can't remember the name of a person you have just met?"
    ],
    options: [
      { value: 0, label: "Never", points: 0 },
      { value: 1, label: "Very Rarely", points: 1 },
      { value: 2, label: "Quite Often", points: 2 },
      { value: 3, label: "Very Often", points: 3 },
      { value: 4, label: "Always", points: 4 }
    ],
    maxScore: 100,
    getSeverity: (score) => {
      if (score <= 30) return { level: 'Low Cognitive Failures', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 50) return { level: 'Moderate Cognitive Failures', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Cognitive Failures', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 6. Social Relationships & Interpersonal Issues
  ssi: {
    name: 'Social Skills Inventory (SSI)',
    category: 'Social Relationships & Interpersonal Issues',
    questions: [
      "I start conversations with people I don't know.",
      "I join in conversations when I have something to say.",
      "I introduce myself to people I don't know.",
      "I ask questions when I don't understand something.",
      "I make eye contact when talking to people.",
      "I smile at people I don't know.",
      "I say 'thank you' when appropriate.",
      "I ask for help when I need it.",
      "I compliment others when appropriate.",
      "I express my opinions clearly.",
      "I listen attentively when others speak.",
      "I respond appropriately to what others say.",
      "I maintain appropriate personal space.",
      "I use appropriate body language.",
      "I end conversations politely."
    ],
    options: [
      { value: 0, label: "Never", points: 0 },
      { value: 1, label: "Rarely", points: 1 },
      { value: 2, label: "Sometimes", points: 2 },
      { value: 3, label: "Often", points: 3 },
      { value: 4, label: "Always", points: 4 }
    ],
    maxScore: 60,
    getSeverity: (score) => {
      if (score >= 45) return { level: 'Strong Social Skills', color: 'text-green-600', bg: 'bg-green-50' };
      if (score >= 30) return { level: 'Moderate Social Skills', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Weak Social Skills', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  iri: {
    name: 'Interpersonal Reactivity Index (IRI)',
    category: 'Social Relationships & Interpersonal Issues',
    questions: [
      "I often have tender, concerned feelings for people less fortunate than me.",
      "Sometimes I don't feel very sorry for other people when they are having problems.",
      "When I see someone being taken advantage of, I feel kind of protective towards them.",
      "Other people's misfortunes do not usually disturb me a great deal.",
      "When I see someone being treated unfairly, I sometimes feel very sorry for them.",
      "I am often quite touched by things that I see happen.",
      "I would describe myself as a pretty soft-hearted person.",
      "When I see someone who badly needs help in an emergency, I go to pieces.",
      "Before criticizing somebody, I try to imagine how I would feel if I were in their place.",
      "When I see someone being treated unfairly, I feel very sorry for them.",
      "I sometimes find it difficult to see things from the 'other guy's' point of view.",
      "I try to look at everybody's side of a disagreement before I make a decision.",
      "When I'm upset at someone, I usually try to 'put myself in his shoes' for a moment.",
      "I believe that there are two sides to every question and try to look at them both.",
      "I sometimes try to understand my friends better by imagining how things look from their perspective.",
      "I sometimes feel helpless when I am in the middle of a very emotional situation.",
      "I sometimes feel very sorry for other people when they are having problems.",
      "I often have tender, concerned feelings for people less fortunate than me.",
      "When I see someone who badly needs help in an emergency, I go to pieces.",
      "I am often quite touched by things that I see happen.",
      "I would describe myself as a pretty soft-hearted person."
    ],
    options: [
      { value: 0, label: "Does not describe me well", points: 0 },
      { value: 1, label: "Describes me somewhat", points: 1 },
      { value: 2, label: "Describes me very well", points: 2 },
      { value: 3, label: "Describes me extremely well", points: 3 }
    ],
    maxScore: 84,
    getSeverity: (score) => {
      if (score >= 60) return { level: 'High Empathy', color: 'text-green-600', bg: 'bg-green-50' };
      if (score >= 40) return { level: 'Moderate Empathy', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Low Empathy', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  ucla_loneliness: {
    name: 'UCLA Loneliness Scale',
    category: 'Social Relationships & Interpersonal Issues',
    questions: [
      "I feel in tune with the people around me.",
      "I lack companionship.",
      "There is no one I can turn to.",
      "I do not feel alone.",
      "I feel part of a group of friends.",
      "I have friends with whom I can talk about my problems.",
      "There are people who really understand me.",
      "I am no longer close to anyone.",
      "My interests and ideas are not shared by those around me.",
      "I am an outgoing person.",
      "People are around me but not with me.",
      "I feel left out.",
      "My social relationships are superficial.",
      "No one really knows me well.",
      "I feel isolated from others.",
      "I can find companionship when I want it.",
      "I am unhappy being so withdrawn.",
      "People are generally unfriendly toward me.",
      "I do not feel shy.",
      "I am able to reach out and communicate with those around me."
    ],
    options: [
      { value: 0, label: "Never", points: 1 },
      { value: 1, label: "Rarely", points: 2 },
      { value: 2, label: "Sometimes", points: 3 },
      { value: 3, label: "Often", points: 4 }
    ],
    reverseScored: [0, 3, 4, 5, 6, 9, 15, 19], // Positive items
    maxScore: 80,
    getSeverity: (score) => {
      if (score <= 30) return { level: 'Low Loneliness', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 50) return { level: 'Moderate Loneliness', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'High Loneliness', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 7. Sleep Issues
  isi: {
    name: 'Insomnia Severity Index (ISI)',
    category: 'Sleep Issues',
    questions: [
      "Difficulty falling asleep",
      "Difficulty staying asleep",
      "Problems waking up too early",
      "How satisfied/dissatisfied are you with your current sleep pattern?",
      "How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?",
      "How worried/distressed are you about your current sleep problem?",
      "To what extent do you consider your sleep problem to interfere with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, mood, etc.)?"
    ],
    options: [
      { value: 0, label: "None", points: 0 },
      { value: 1, label: "Mild", points: 1 },
      { value: 2, label: "Moderate", points: 2 },
      { value: 3, label: "Severe", points: 3 },
      { value: 4, label: "Very Severe", points: 4 }
    ],
    maxScore: 28,
    getSeverity: (score) => {
      if (score <= 7) return { level: 'No Clinically Significant Insomnia', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 14) return { level: 'Subthreshold Insomnia', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (score <= 21) return { level: 'Clinical Insomnia (Moderate)', color: 'text-orange-600', bg: 'bg-orange-50' };
      return { level: 'Clinical Insomnia (Severe)', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  psqi: {
    name: 'Pittsburgh Sleep Quality Index (PSQI)',
    category: 'Sleep Issues',
    questions: [
      "During the past month, what time have you usually gone to bed at night?",
      "During the past month, how long (in minutes) has it usually taken you to fall asleep each night?",
      "During the past month, what time have you usually gotten up in the morning?",
      "During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spend in bed.)",
      "During the past month, how often have you had trouble sleeping because you...",
      "...cannot get to sleep within 30 minutes?",
      "...wake up in the middle of the night or early morning?",
      "...have to get up to use the bathroom?",
      "...cannot breathe comfortably?",
      "...cough or snore loudly?",
      "...feel too cold?",
      "...feel too hot?",
      "...had bad dreams?",
      "...have pain?",
      "During the past month, how often have you taken medicine to help you sleep (prescribed or 'over the counter')?",
      "During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?",
      "During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?",
      "During the past month, how would you rate your overall sleep quality?"
    ],
    options: [
      { value: 0, label: "Not during the past month", points: 0 },
      { value: 1, label: "Less than once a week", points: 1 },
      { value: 2, label: "Once or twice a week", points: 2 },
      { value: 3, label: "Three or more times a week", points: 3 }
    ],
    maxScore: 21,
    getSeverity: (score) => {
      if (score <= 5) return { level: 'Good Sleep Quality', color: 'text-green-600', bg: 'bg-green-50' };
      if (score <= 10) return { level: 'Fair Sleep Quality', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Poor Sleep Quality', color: 'text-red-600', bg: 'bg-red-50' };
    }
  },

  // 8. Behavioral & Lifestyle Factors
  dast10: {
    name: 'Drug Abuse Screening Test (DAST-10)',
    category: 'Behavioral & Lifestyle Factors',
    questions: [
      "Have you used drugs other than those required for medical reasons?",
      "Have you abused prescription drugs?",
      "Do you abuse more than one drug at a time?",
      "Can you get through the week without using drugs?",
      "Are you always able to stop using drugs when you want to?",
      "Have you had 'blackouts' or 'flashbacks' as a result of drug use?",
      "Do you ever feel bad or guilty about your drug use?",
      "Does your spouse (or parents) ever complain about your involvement with drugs?",
      "Have you neglected your family because of your use of drugs?",
      "Have you engaged in illegal activities in order to obtain drugs?"
    ],
    options: [
      { value: 0, label: "No", points: 0 },
      { value: 1, label: "Yes", points: 1 }
    ],
    maxScore: 10,
    getSeverity: (score) => {
      if (score <= 2) return { level: 'Low Drug Use Risk
