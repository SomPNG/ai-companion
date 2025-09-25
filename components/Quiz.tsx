
import React, { useState } from 'react';
import { QuizData } from '../types';

interface QuizProps {
    quizData: QuizData;
    onReset: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ quizData, onReset }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = quizData.questions[currentQuestionIndex];

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;
        
        setSelectedAnswer(option);
        setIsAnswered(true);
        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };
    
    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return 'bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600';
        }
        if (option === currentQuestion.correctAnswer) {
            return 'bg-green-200 dark:bg-green-800 border-green-500';
        }
        if (option === selectedAnswer) {
            return 'bg-red-200 dark:bg-red-800 border-red-500';
        }
        return 'bg-slate-100 dark:bg-slate-700 opacity-60';
    };

    if (showResults) {
        return (
            <div className="text-center p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">{quizData.quizTitle} - Results</h2>
                <p className="text-lg mb-4">You scored <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> out of <span className="font-bold">{quizData.questions.length}</span></p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-6">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(score / quizData.questions.length) * 100}%` }}></div>
                </div>
                <button
                    onClick={onReset}
                    className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Start a New Topic
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{quizData.quizTitle}</h2>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {currentQuestionIndex + 1} / {quizData.questions.length}
                </span>
            </div>
            
            <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg mb-6">
                 <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{currentQuestion.questionText}</p>
            </div>
           

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-300 ${getButtonClass(option)}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            
            {isAnswered && (
                <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {selectedAnswer === currentQuestion.correctAnswer ? 'Correct! 🎉' : 'Not quite!'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{currentQuestion.explanation}</p>
                    <button
                        onClick={handleNext}
                        className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {currentQuestionIndex < quizData.questions.length - 1 ? 'Next Question' : 'Show Results'}
                    </button>
                </div>
            )}
        </div>
    );
};
