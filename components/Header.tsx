import React from 'react';
import { View } from '../App';

interface HeaderProps {
    onHomeClick: () => void;
    setView: (view: View) => void;
    currentView: View;
}

const NavButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => {
    const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600";
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    )
}


export const Header: React.FC<HeaderProps> = ({ onHomeClick, setView, currentView }) => {
    return (
        <header className="w-full max-w-4xl mx-auto text-center py-6 sm:py-8 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div onClick={onHomeClick} className="flex items-center justify-center gap-3 cursor-pointer group" title="Go to homepage">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
                        <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-2 13.5v-1c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5zm-1.12-4.12l.71.71c.2.2.51.2.71 0l1.41-1.41c.2-.2.2-.51 0-.71l-1.77-1.77c-.2-.2-.51-.2-.71 0l-1.41 1.41c-.2.2-.2.51 0 .71zm4.83.71l.71-.71c.2-.2.2-.51 0-.71l-1.41-1.41c-.2-.2-.51-.2-.71 0L10.24 9.9c-.2.2-.2.51 0 .71l1.77 1.77c.2.2.51.2.71 0z" />
                    </svg>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text group-hover:opacity-80 transition-opacity">
                        AI Learning Companion
                    </h1>
                </div>

                {currentView !== 'landing' && (
                    <nav className="flex items-center gap-2 sm:gap-4 animate-fade-in">
                        <NavButton onClick={() => setView('quiz')} isActive={currentView === 'quiz'}>
                            Quiz Generator
                        </NavButton>
                        <NavButton onClick={() => setView('pomodoro')} isActive={currentView === 'pomodoro'}>
                            Focus Timer
                        </NavButton>
                    </nav>
                )}
            </div>
            {currentView === 'landing' && (
                 <p className="mt-2 text-md text-slate-500 dark:text-slate-400">Turn hard topics into fun with a personalized quiz!</p>
            )}
        </header>
    );
};