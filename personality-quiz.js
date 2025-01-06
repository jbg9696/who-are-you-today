// Card Components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
        {children}
    </div>
);

// Quiz Menu Component
const QuizMenu = ({ onSelectQuiz }) => {
    const quizzes = [
        {
            id: 'personality',
            title: 'Who Are You?',
            description: 'Discover your personality type for today',
            emoji: '🎭'
        },
        {
            id: 'element',
            title: 'What Element?',
            description: 'Find your elemental nature',
            emoji: '🌪️'
        }
        // Add more quiz types here
    ];

    return (
        <div className="min-h-screen p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
                        Who Are You Today?
                    </h1>
                    <p className="text-gray-600 text-xl">
                        Take a daily quiz and discover a new side of yourself
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <button
                            key={quiz.id}
                            onClick={() => onSelectQuiz(quiz.id)}
                            className="w-full bg-white p-6 rounded-xl shadow-lg hover:shadow-xl 
                                     transition-all transform hover:-translate-y-1 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{quiz.emoji}</span>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{quiz.title}</h3>
                                    <p className="text-gray-600">{quiz.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Quiz Component
const QuizComponent = ({ quiz, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [answers, setAnswers] = React.useState([]);
    const [showResult, setShowResult] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const [streak, setStreak] = React.useState(0);
    const [timeUntilNext, setTimeUntilNext] = React.useState('');

    // Get today's questions
    const todaysQuestions = React.useMemo(() => {
        const seed = getDailySeed();
        return [...quiz.questions]
            .sort((a, b) => ((seed * quiz.questions.indexOf(a)) % 13) - 
                           ((seed * quiz.questions.indexOf(b)) % 13))
            .slice(0, 5);
    }, [quiz.questions]);

    // Handle answer selection
    const handleAnswer = (trait) => {
        const newAnswers = [...answers, trait];
        setAnswers(newAnswers);

        if (currentQuestion < 4) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate result
            const traits = newAnswers.reduce((acc, t) => {
                acc[t] = (acc[t] || 0) + 1;
                return acc;
            }, {});
            const resultTrait = Object.entries(traits)
                .reduce((a, b) => traits[a[0]] > traits[b[0]] ? a : b)[0];

            setResult(quiz.results[resultTrait]);
            setShowResult(true);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={onBack}
                className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
                <lucide.ArrowLeft className="w-4 h-4" />
                Back to Menu
            </button>

            <Card>
                <div className="p-6">
                    {!showResult ? (
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Question {currentQuestion + 1}/5</span>
                            </div>
                            
                            <h3 className="text-xl text-center mb-8">
                                {todaysQuestions[currentQuestion].question}
                            </h3>

                            <div className="grid gap-3">
                                {todaysQuestions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(option.trait)}
                                        className="w-full p-4 text-left rounded-lg bg-blue-50 
                                                 hover:bg-blue-100 transition-colors border 
                                                 border-blue-200"
                                    >
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="mb-8">
                                <span className="text-6xl mb-4 block">{result.emoji}</span>
                                <h2 className="text-2xl font-bold gradient-text mb-4">
                                    {result.title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {result.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

// Main App
const App = () => {
    const [selectedQuiz, setSelectedQuiz] = React.useState(null);

    const handleBack = () => {
        setSelectedQuiz(null);
    };

    return selectedQuiz ? (
        <QuizComponent 
            quiz={quizData[selectedQuiz]} 
            onBack={handleBack}
        />
    ) : (
        <QuizMenu onSelectQuiz={setSelectedQuiz} />
    );
};

// Render the app
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
