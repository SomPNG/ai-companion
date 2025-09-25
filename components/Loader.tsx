
import React from 'react';

export const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Your personal quiz is being created...</p>
        </div>
    );
};
