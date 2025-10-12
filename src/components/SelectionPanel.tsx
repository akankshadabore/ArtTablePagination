import React from 'react';
import type { SelectedIds } from '../types';
import { Spinner } from './common/Spinner';

interface SelectionPanelProps {
    selectedIds: SelectedIds;
    summaryLoading: boolean;
    clearSelection: () => void;
    handleGenerateSummary: () => Promise<void>;
}


export const SelectionPanel: React.FC<SelectionPanelProps> = ({ 
    selectedIds, 
    summaryLoading, 
    clearSelection, 
    handleGenerateSummary,
}) => {
    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
                Persistent Selection Status
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
                Total Artworks Selected: <span className="font-bold text-xl text-purple-600 dark:text-purple-400">{selectedIds.size}</span>
            </p>
            
            <div className="flex flex-wrap gap-3 mt-4">
                <button
                    className={`px-5 py-2 text-white font-medium rounded-lg shadow-lg transition duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] ${
                        selectedIds.size > 0 && !summaryLoading
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-purple-400 cursor-not-allowed opacity-70'
                    }`}
                    onClick={handleGenerateSummary}
                    disabled={selectedIds.size === 0 || summaryLoading}
                >
                    {summaryLoading ? (
                        <>
                            <Spinner />
                            <span className="ml-2">Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <span className="mr-2 text-lg">✨</span> Analyze Collection ({Math.min(selectedIds.size, 10)} IDs)
                        </>
                    )}
                </button>
                
                <button
                    className="px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={clearSelection}
                >
                    Clear All Selections
                </button>
            </div>
        </div>
    );
};