import React from 'react';

interface LandingPageProps {
    onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="text-center animate-fade-in">
            <div className="mb-6">
                <span className="text-6xl" role="img" aria-label="brain and sparkles emoji">🧠✨</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
                Feeling Stuck? Let's Make Learning Fun.
            </h1>
            <p className="max-w-xl mx-auto text-lg text-slate-600 dark:text-slate-300 mb-8">
                Tell us how you feel about a topic, and our friendly AI will create a personalized quiz to help you understand it better, one question at a time.
            </p>
            <button
                onClick={onStart}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
                Get Started
            </button>
        </div>
    );
};