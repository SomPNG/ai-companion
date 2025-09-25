import React, { useState } from 'react';

interface InputFormProps {
    onSubmit: (userInput: string) => void;
    isLoading: boolean;
}

const suggestions = [
    'Algebraic Equations',
    'Photosynthesis',
    'World War II',
    'Python Loops',
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [userInput, setUserInput] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(userInput);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h2 className="text-xl font-semibold text-center mb-4 text-slate-700 dark:text-slate-200">How are you feeling about your lesson?</h2>
            <p className="text-center mb-6 text-slate-500 dark:text-slate-400">
                For example: "I'm so confused by calculus derivatives" or "History dates are so hard to remember!"
            </p>

            {/* Suggestions Section */}
            <div className="w-full text-center mb-6">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                    Click a topic to get started:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setUserInput(suggestion)}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 rounded-full hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Tell me what's on your mind..."
                    className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow bg-slate-50 dark:bg-slate-700"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>
        </div>
    );
};