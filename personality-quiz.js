const quizData = {
    personality: {
        title: "Who Are You Today?",
        questions: [
            {
                question: "How do you prefer to spend your mornings?",
                options: [
                    { text: "Planning and organizing the day", trait: "organized" },
                    { text: "Creating something new", trait: "creative" },
                    { text: "Connecting with friends", trait: "social" },
                    { text: "Learning something interesting", trait: "curious" }
                ]
            },
            {
                question: "What energizes you most?",
                options: [
                    { text: "Completing tasks", trait: "organized" },
                    { text: "Expressing yourself", trait: "creative" },
                    { text: "Being with others", trait: "social" },
                    { text: "Discovering new things", trait: "curious" }
                ]
            },
            {
                question: "When faced with a problem, you first...",
                options: [
                    { text: "Make a detailed plan", trait: "organized" },
                    { text: "Think outside the box", trait: "creative" },
                    { text: "Ask others for input", trait: "social" },
                    { text: "Research thoroughly", trait: "curious" }
                ]
            },
            {
                question: "Your ideal weekend involves...",
                options: [
                    { text: "Organizing your space", trait: "organized" },
                    { text: "Making something", trait: "creative" },
                    { text: "Meeting friends", trait: "social" },
                    { text: "Exploring new places", trait: "curious" }
                ]
            },
            {
                question: "What's your best quality?",
                options: [
                    { text: "Being reliable", trait: "organized" },
                    { text: "Being innovative", trait: "creative" },
                    { text: "Being supportive", trait: "social" },
                    { text: "Being insightful", trait: "curious" }
                ]
            }
        ],
        results: {
            organized: {
                title: "The Planner",
                description: "You're methodical and love creating order from chaos. Your ability to structure and organize makes you an invaluable leader!",
                emoji: "📋"
            },
            creative: {
                title: "The Artist",
                description: "Your creative spirit brings beauty to everything you touch. You see the world in unique and inspiring ways!",
                emoji: "🎨"
            },
            social: {
                title: "The Connector",
                description: "You bring people together with your warm energy. Your empathy and understanding create strong bonds!",
                emoji: "🤝"
            },
            curious: {
                title: "The Explorer",
                description: "Your thirst for knowledge drives you forward. You're always seeking to understand more about everything!",
                emoji: "🔍"
            }
        }
    },
    element: {
        title: "What Element Are You?",
        questions: [
            {
                question: "How do you handle conflict?",
                options: [
                    { text: "Face it head-on with passion", trait: "fire" },
                    { text: "Flow around obstacles gracefully", trait: "water" },
                    { text: "Stand firm and unmovable", trait: "earth" },
                    { text: "Rise above it with clarity", trait: "air" }
                ]
            }
            // Add more questions for element quiz
        ],
        results: {
            fire: {
                title: "Fire Element",
                description: "You burn bright with passion and energy!",
                emoji: "🔥"
            },
            // Add more results
        }
    }
    // Add more quiz types here
};

// Helper function for getting daily questions
const getDailySeed = () => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};
