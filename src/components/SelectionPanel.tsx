import type { SelectedIds } from '../types';

interface SelectionPanelProps {
    selectedIds: SelectedIds;
    clearSelection: () => void;
}

export const SelectionPanel: React.FC<SelectionPanelProps> = ({ selectedIds, clearSelection }) => {
    return (
 <div className="flex justify-around p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
 <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2 pt-4">
    Selection Overview
 </h3>
 <p className="text-gray-600 dark:text-gray-300 pt-4">
     Total Artworks Selected: <span className="font-bold text-xl text-purple-600 dark:text-purple-400">{selectedIds.size}</span>
 </p>

 <div className="gap-3 mt-4">
 <button
   className="px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
 onClick={clearSelection} >
  Clear All Selections
 </button>
    </div>
 </div>
    );
};

