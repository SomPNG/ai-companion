import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes
const NOTIFICATION_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

interface SessionHistory {
    type: 'Focus' | 'Break';
    duration: string;
    completedAt: string;
}

const formatTimeFromSeconds = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const PomodoroClock: React.FC = () => {
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
    const [isActive, setIsActive] = useState(false);
    const [history, setHistory] = useState<SessionHistory[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Load history from localStorage on initial render
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('pomodoroHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage:", error);
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('pomodoroHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history to localStorage:", error);
        }
    }, [history]);

    useEffect(() => {
        let intervalId: number | null = null;

        if (isActive && timeRemaining > 0) {
            intervalId = window.setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (timeRemaining === 0 && isActive) {
            audioRef.current?.play();
            
            // Log the completed session
            const newEntry: SessionHistory = {
                type: mode === 'work' ? 'Focus' : 'Break',
                duration: formatTimeFromSeconds(mode === 'work' ? WORK_DURATION : BREAK_DURATION),
                completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setHistory(prev => [newEntry, ...prev]);

            // Switch mode
            setMode(prevMode => {
                if (prevMode === 'work') {
                    setTimeRemaining(BREAK_DURATION);
                    return 'break';
                }
                setTimeRemaining(WORK_DURATION);
                return 'work';
            });
            setIsActive(false); // Pause timer after session completes
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isActive, timeRemaining, mode]);

    const toggleTimer = useCallback(() => {
        setIsActive(prev => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setMode('work');
        setTimeRemaining(WORK_DURATION);
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    const formatTime = useMemo(() => formatTimeFromSeconds(timeRemaining), [timeRemaining]);

    const progress = useMemo(() => {
        const totalDuration = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
        return ((totalDuration - timeRemaining) / totalDuration) * 100;
    }, [timeRemaining, mode]);

    const isWorkMode = mode === 'work';

    const themeClasses = isWorkMode
      ? {
          text: 'text-blue-600 dark:text-blue-400',
          progress: 'text-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        }
      : {
          text: 'text-green-600 dark:text-green-400',
          progress: 'text-green-500',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        };

    return (
        <div className="w-full bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300 animate-fade-in flex flex-col items-center">
            <audio ref={audioRef} src={NOTIFICATION_SOUND_URL} preload="auto"></audio>
            
            <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>
                {isWorkMode ? 'Focus Session' : 'Break Time'}
            </h2>
            <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-slate-200 dark:text-slate-700"
                        strokeWidth="7"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className={themeClasses.progress}
                        strokeWidth="7"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: 2 * Math.PI * 45,
                            strokeDashoffset: (2 * Math.PI * 45) * (1 - progress / 100),
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            transition: 'stroke-dashoffset 0.5s linear'
                        }}
                    />
                </svg>
                <div className="absolute text-5xl font-mono font-bold text-slate-800 dark:text-slate-100">
                    {formatTime}
                </div>
            </div>
            <div className="flex space-x-4 mt-8">
                <button
                    onClick={toggleTimer}
                    className={`px-8 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${themeClasses.button}`}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={resetTimer}
                    className="px-8 py-3 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
                >
                    Reset
                </button>
            </div>
            
            {/* Session History Section */}
            <div className="w-full mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Session History</h3>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2 text-sm">
                    {history.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-center">No completed sessions yet. Start the timer to begin!</p>
                    ) : (
                        history.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                <span className={`font-semibold ${item.type === 'Focus' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                                    {item.type}
                                </span>
                                <span className="text-slate-600 dark:text-slate-300">{item.duration}</span>
                                <span className="text-slate-400 dark:text-slate-500">{item.completedAt}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
