import React from 'react';
import type { Source } from '../types';

interface SummaryPanelProps {
    generatedSummary: string;
    summaryError: string;
    sources: Source[];
}


export const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
    generatedSummary, 
    summaryError, 
    sources 
}) => {
    if (!generatedSummary && !summaryError) {
        return null;
    }

    return (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-purple-200 dark:border-purple-900">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center">
                <span className="mr-2 text-3xl">💡</span> Curatorial Analysis
            </h3>
            
            {summaryError ? (
                <p className="text-red-500 font-medium p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {summaryError}
                </p>
            ) : (
                <>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {generatedSummary}
                    </p>
                    
                    {sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                Grounding Sources:
                            </p>
                            <ul className="list-disc list-inside text-sm text-indigo-500 dark:text-indigo-300 space-y-1">
                                {sources.map((source, index) => (
                                    <li key={index} className="truncate">
                                        <a 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            title={source.title}
                                            className="hover:underline"
                                        >
                                            {source.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};