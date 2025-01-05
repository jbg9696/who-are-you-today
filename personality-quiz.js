// Basic UI components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-center">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);

// Icons
const Clock = ({ className = "" }) => (
  <lucide.Clock className={className} />
);

const Share2 = ({ className = "" }) => (
  <lucide.Share2 className={className} />
);

const Trophy = ({ className = "" }) => (
  <lucide.Trophy className={className} />
);

const BarChart2 = ({ className = "" }) => (
  <lucide.BarChart2 className={className} />
);

const PersonalityQuiz = () => {
  // State management for all features
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [hasPlayedToday, setHasPlayedToday] = React.useState(false);
  const [todaysResult, setTodaysResult] = React.useState(null);
  const [streak, setStreak] = React.useState(0);
  const [timeUntilNext, setTimeUntilNext] = React.useState('');
  const [stats, setStats] = React.useState({
    adventurer: 0,
    intellectual: 0,
    social: 0,
    creative: 0,
    totalPlays: 0
  });
  const [showStats, setShowStats] = React.useState(false);

  // Get deterministic daily seed based on date
  const getDailySeed = () => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  };

  // Check if user has played today and load their stats
  React.useEffect(() => {
    const lastPlayed = localStorage.getItem('lastPlayedDate');
    const savedResult = localStorage.getItem('lastResult');
    const savedStreak = localStorage.getItem('streak');
    const savedStats = localStorage.getItem('stats');
    const today = new Date().toDateString();

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedStats) setStats(JSON.parse(savedStats));

    if (lastPlayed === today) {
      setHasPlayedToday(true);
      setTodaysResult(savedResult);
      setShowResult(true);
    } else if (lastPlayed) {
      // Check if streak is broken
      const lastPlayedDate = new Date(lastPlayed);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastPlayedDate < yesterday) {
        setStreak(0);
        localStorage.setItem('streak', '0');
      }
    }
  }, []);

  // Update countdown timer
  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeLeft = tomorrow - now;
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, []);

  // Question pool
  const allQuestions = [
    {
      question: "How do you prefer to spend your free time?",
      options: [
        { text: "Being active outdoors", trait: "adventurer" },
        { text: "Reading or learning new things", trait: "intellectual" },
        { text: "Hanging out with friends", trait: "social" },
        { text: "Creating or making things", trait: "creative" }
      ]
    },
    {
      question: "What's your approach to solving problems?",
      options: [
        { text: "Jump right in and figure it out", trait: "adventurer" },
        { text: "Research and analyze carefully", trait: "intellectual" },
        { text: "Ask others for their input", trait: "social" },
        { text: "Think outside the box", trait: "creative" }
      ]
    },
    {
      question: "What would be your dream celebration?",
      options: [
        { text: "Adventure sports or skydiving", trait: "adventurer" },
        { text: "A thought-provoking discussion", trait: "intellectual" },
        { text: "Big party with all your friends", trait: "social" },
        { text: "Creating art or performing", trait: "creative" }
      ]
    },
    {
      question: "How do you recharge after a long day?",
      options: [
        { text: "Going for a run or workout", trait: "adventurer" },
        { text: "Reading or watching documentaries", trait: "intellectual" },
        { text: "Calling friends or family", trait: "social" },
        { text: "Working on personal projects", trait: "creative" }
      ]
    },
    {
      question: "What's your ideal weekend morning?",
      options: [
        { text: "Early hike to catch the sunrise", trait: "adventurer" },
        { text: "Reading the news with coffee", trait: "intellectual" },
        { text: "Brunch with friends", trait: "social" },
        { text: "Working on a creative project", trait: "creative" }
      ]
    }
  ];

  // Get today's questions using the seed
  const getDaily5Questions = () => {
    const seed = getDailySeed();
    return [...allQuestions]
      .sort((a, b) => ((seed * allQuestions.indexOf(a)) % 13) - 
                      ((seed * allQuestions.indexOf(b)) % 13))
      .slice(0, 5);
  };

  const questions = getDaily5Questions();

  const personalities = {
    adventurer: {
      title: "The Adventurer",
      description: "You're bold, spontaneous, and always ready for action! Like a majestic eagle, you soar towards new experiences and challenges with enthusiasm.",
      emoji: "🦅"
    },
    intellectual: {
      title: "The Intellectual",
      description: "You're thoughtful, curious, and love to learn! Like a wise owl, you observe carefully and gather knowledge wherever you go.",
      emoji: "🦉"
    },
    social: {
      title: "The Social Butterfly",
      description: "You're friendly, outgoing, and great with people! Like a playful dolphin, you bring joy and connection to those around you.",
      emoji: "🐬"
    },
    creative: {
      title: "The Creative Spirit",
      description: "You're imaginative, artistic, and full of unique ideas! Like a colorful peacock, you express yourself in beautiful and original ways.",
      emoji: "🦚"
    }
  };

  const handleAnswer = (trait) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateResult(newAnswers);
      const today = new Date().toDateString();
      
      // Update storage and stats
      localStorage.setItem('lastPlayedDate', today);
      localStorage.setItem('lastResult', result);
      
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('streak', newStreak.toString());
      
      // Update stats
      const newStats = {
        ...stats,
        [result]: stats[result] + 1,
        totalPlays: stats.totalPlays + 1
      };
      setStats(newStats);
      localStorage.setItem('stats', JSON.stringify(newStats));
      
      setTodaysResult(result);
      setHasPlayedToday(true);
      setShowResult(true);
    }
  };

  const calculateResult = (finalAnswers) => {
    const traits = finalAnswers.reduce((acc, trait) => {
      acc[trait] = (acc[trait] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(traits).reduce((a, b) => 
      (traits[a[0]] > traits[b[0]] ? a : b))[0];
  };

  const shareResult = async () => {
    const personality = personalities[todaysResult];
    const shareText = `Who Are You Today? #${getDailySeed()}\n` +
                     `Today I am ${personality.title} ${personality.emoji}\n` +
                     `Streak: ${streak} days\n` +
                     `Play at: https://jbg9696.github.io/who-are-you-today/`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Result copied to clipboard!');
    } catch (err) {
      alert('Failed to copy result. You can manually copy the text instead.');
    }
  };

  const StatBar = ({ value, max, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div 
        className={`${color} h-4 rounded-full transition-all duration-500`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );

  const ResultDisplay = ({ personalityType }) => (
    <div className="text-center space-y-4">
      <h2 className="text-xl font-bold mb-2">
        {personalities[personalityType].title} {personalities[personalityType].emoji}
      </h2>
      <p className="text-lg mb-4">
        {personalities[personalityType].description}
      </p>
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Streak: {streak} days</span>
        </div>
        <button
          onClick={shareResult}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <BarChart2 className="w-5 h-5" />
          Stats
        </button>
      </div>
      {showStats && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">Your Personality Stats</h3>
          <div className="space-y-2">
            {Object.entries(personalities).map(([type, data]) => (
              <div key={type}>
                <div className="flex justify-between mb-1">
                  <span>{data.title}</span>
                  <span>{Math.round((stats[type] / stats.totalPlays) * 100)}%</span>
                </div>
                <StatBar 
                  value={stats[type]} 
                  max={stats.totalPlays} 
                  color={`bg-${type === "adventurer" ? "red" : 
                          type === "intellectual" ? "blue" :
                          type === "social" ? "green" : "purple"}-500`} 
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Total plays: {stats.totalPlays}
          </p>
        </div>
      )}
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <Clock className="w-5 h-5" />
        <span>Next quiz available in: {timeUntilNext}</span>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Who Are You Today?</CardTitle>
      </CardHeader>
      <CardContent>
        {hasPlayedToday ? (
          <ResultDisplay personalityType={todaysResult} />
        ) : !showResult ? (
          <div className="space-y-4">
            <p className="text-lg mb-
