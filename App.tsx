import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputForm } from './components/InputForm';
import { EmotionDisplay } from './components/EmotionDisplay';
import { Quiz } from './components/Quiz';
import { Loader } from './components/Loader';
import { LandingPage } from './components/LandingPage';
import { PomodoroClock } from './components/PomodoroClock';
import { analyzeAndCreateQuiz } from './services/geminiService';
import { QuizData } from './types';

export type View = 'landing' | 'quiz' | 'pomodoro';

const App: React.FC = () => {
    const [view, setView] = useState<View>('landing');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<QuizData | null>(null);

    const handleGenerateQuiz = useCallback(async (userInput: string) => {
        if (!userInput.trim()) {
            setError("Please tell me how you're feeling about your lesson.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setQuizData(null);
        try {
            const data = await analyzeAndCreateQuiz(userInput);
            setQuizData(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleResetQuiz = () => {
        setQuizData(null);
        setError(null);
        setIsLoading(false);
    };

    const handleGoHome = () => {
        setView('landing');
        setQuizData(null);
        setError(null);
        setIsLoading(false);
    };

    const renderQuizContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return (
                <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-semibold">Oops! Something went wrong.</p>
                    <p>{error}</p>
                    <button
                        onClick={handleResetQuiz}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        if (quizData) {
            return (
                <>
                    <EmotionDisplay emotion={quizData.emotion} topic={quizData.topic} />
                    <Quiz quizData={quizData} onReset={handleResetQuiz} />
                </>
            );
        }
        return <InputForm onSubmit={handleGenerateQuiz} isLoading={isLoading} />;
    };

    const renderMainContent = () => {
        switch (view) {
            case 'landing':
                return <LandingPage onStart={() => setView('quiz')} />;
            case 'quiz':
                return (
                    <div className="w-full bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                        {renderQuizContent()}
                    </div>
                );
            case 'pomodoro':
                return <PomodoroClock />;
            default:
                return <LandingPage onStart={() => setView('quiz')} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 transition-colors duration-300">
            <Header onHomeClick={handleGoHome} setView={setView} currentView={view} />
            <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center items-center px-4">
                {renderMainContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
