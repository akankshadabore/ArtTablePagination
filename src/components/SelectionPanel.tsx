import type { SelectedIds } from '../types';

interface SelectionPanelProps {
    selectedIds: SelectedIds;
    clearSelection: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({ selectedIds, clearSelection }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 gap-3">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-indigo-700 dark:text-indigo-400 text-center sm:text-left">
                Selection Overview
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center sm:text-left">
                Total Artworks Selected: <span className="font-bold text-lg sm:text-xl text-purple-600 dark:text-purple-400">{selectedIds.size}</span>
            </p>

            <div className="w-full sm:w-auto">
                <button
                    className="w-full sm:w-auto px-4 sm:px-5 py-2 text-sm sm:text-base text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={clearSelection}
                >
                    Clear All Selections
                </button>
            </div>
        </div>
    );

};

