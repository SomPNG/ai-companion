
import React from 'react';

interface EmotionDisplayProps {
    emotion: string;
    topic: string;
}

const emotionEmojis: { [key: string]: string } = {
    frustration: '😤',
    confusion: '🤔',
    curiosity: '🧐',
    excitement: '🤩',
    boredom: '😴',
    stress: '😫',
    default: '😊',
};

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, topic }) => {
    const emotionKey = emotion.toLowerCase();
    const emoji = emotionEmojis[emotionKey] || emotionEmojis.default;

    return (
        <div className="text-center mb-8 p-4 bg-blue-50 dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-slate-600">
            <p className="text-4xl mb-2">{emoji}</p>
            <p className="text-lg text-slate-700 dark:text-slate-200">
                It sounds like you're feeling a bit <strong className="font-semibold text-blue-600 dark:text-blue-400">{emotion.toLowerCase()}</strong> about <strong className="font-semibold text-blue-600 dark:text-blue-400">{topic}</strong>.
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Let's try a fun quiz to help clear things up!</p>
        </div>
    );
};
