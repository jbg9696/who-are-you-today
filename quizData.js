const QuizBase = ({ title, questions, results, storageKey, onBackToMenu }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [hasPlayedToday, setHasPlayedToday] = React.useState(false);
  const [todaysResult, setTodaysResult] = React.useState(null);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [timeUntilNext, setTimeUntilNext] = React.useState('');
  const [showStats, setShowStats] = React.useState(false);
  const [animation, setAnimation] = React.useState('');
  const [stats, setStats] = React.useState({});

  // Get today's questions using date as seed
  const getTodaysQuestions = () => {
    const seed = getDailySeed();
    return [...questions]
      .sort((a, b) => ((seed * questions.indexOf(a)) % 13) - 
                      ((seed * questions.indexOf(b)) % 13))
      .slice(0, 5);
  };

  const todaysQuestions = React.useMemo(getTodaysQuestions, [questions]);

  // Initialize statistics
  React.useEffect(() => {
    const defaultStats = {
      ...Object.keys(results).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      totalPlays: 0
    };
    setStats(defaultStats);
  }, [results]);

  // Load saved data
  React.useEffect(() => {
    const loadSavedData = async () => {
      const lastPlayed = localStorage.getItem(`${storageKey}_lastPlayed`);
      const savedResult = localStorage.getItem(`${storageKey}_lastResult`);
      const savedStreak = localStorage.getItem(`${storageKey}_streak`);
      const savedBestStreak = localStorage.getItem(`${storageKey}_bestStreak`);
      const savedStats = localStorage.getItem(`${storageKey}_stats`);
      const today = new Date().toDateString();

      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedBestStreak) setBestStreak(parseInt(savedBestStreak));
      if (savedStats) setStats(JSON.parse(savedStats));

      if (lastPlayed === today) {
        setHasPlayedToday(true);
        setTodaysResult(savedResult);
        setShowResult(true);
      } else if (lastPlayed) {
        const lastPlayedDate = new Date(lastPlayed);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastPlayedDate < yesterday) {
          setStreak(0);
          localStorage.setItem(`${storageKey}_streak`, '0');
        }
      }
    };

    loadSavedData();
  }, [storageKey]);

  // Timer for next quiz
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

  const handleAnswer = async (trait) => {
    setAnimation('animate-pulse');
    setTimeout(() => setAnimation(''), 500);

    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    
    if (currentQuestion < todaysQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculateResult(newAnswers);
      const today = new Date().toDateString();
      
      // Update storage
      localStorage.setItem(`${storageKey}_lastPlayed`, today);
      localStorage.setItem(`${storageKey}_lastResult`, result);
      
      // Update streak
      const newStreak = streak + 1;
      const newBestStreak = Math.max(newStreak, bestStreak);
      setStreak(newStreak);
      setBestStreak(newBestStreak);
      localStorage.setItem(`${storageKey}_streak`, newStreak.toString());
      localStorage.setItem(`${storageKey}_bestStreak`, newBestStreak.toString());
      
      // Update stats
      const newStats = {
        ...stats,
        [result]: (stats[result] || 0) + 1,
        totalPlays: (stats.totalPlays || 0) + 1
      };
      setStats(newStats);
      localStorage.setItem(`${storageKey}_stats`, JSON.stringify(newStats));
      
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
    const result = results[todaysResult];
    const shareText = `${title} #${getDailySeed()}\n` +
                     `Today I am ${result.title} ${result.emoji}\n` +
                     `Streak: ${streak} days (Best: ${bestStreak})\n` +
                     `Play at: https://jbg9696.github.io/who-are-you-today/`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Result copied to clipboard!');
    } catch (err) {
      alert('Failed to copy result. You can manually copy the text instead.');
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${animation}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
          
          {hasPlayedToday ? (
            <ResultDisplay
              result={results[todaysResult]}
              streak={streak}
              bestStreak={bestStreak}
              stats={stats}
              showStats={showStats}
              setShowStats={setShowStats}
              onShare={shareResult}
              timeUntilNext={timeUntilNext}
            />
          ) : !showResult ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Question {currentQuestion + 1}/5</span>
                <span>Streak: {streak} (Best: {bestStreak})</span>
              </div>
              <h3 className="text-xl text-center mb-8">
                {todaysQuestions[currentQuestion].question}
              </h3>
              <div className="grid gap-3">
                {todaysQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.trait)}
                    className="w-full p-4 text-left rounded-lg bg-blue-50 hover:bg-blue-100 
                             transition-colors border border-blue-200 hover:border-blue-300"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ResultDisplay
              result={results[todaysResult]}
              streak={streak}
              bestStreak={bestStreak}
              stats={stats}
              showStats={showStats}
              setShowStats={setShowStats}
              onShare={shareResult}
              timeUntilNext={timeUntilNext}
            />
          )}
        </div>
      </div>
    </div>
  );
};