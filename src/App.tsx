import React from 'react';
import { useDataFetching } from './hooks/useDataFetching';
import { usePersistentSelection } from './hooks/usePersistentSelection';
import { useGeminiAnalysis } from './hooks/useAnalysis';
import { SelectionPanel } from './components/SelectionPanel';
import { SummaryPanel } from './components/SummaryPanel';
import { DataTable } from './components/DataTable';


const App: React.FC = () => {
    const { 
        artworks, 
        loading, 
        totalRecords, 
        lazyState, 
        onPage 
    } = useDataFetching();

    
    const {
       selectedIds,
        onRowSelect,
        onRowUnselect,
        onSelectAllChange,
        allRowsSelected,
        clearSelection,
    } = usePersistentSelection(artworks);
    
    
    const {
        generatedSummary,
        summaryLoading,
        summaryError,
        sources,
        handleGenerateSummary,
        clearSummary,
    } = useGeminiAnalysis(selectedIds);

    const handleClearAll = () => {
        clearSelection();
        clearSummary();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-gray-900 font-sans">
            <header className="mb-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-400">
                    Artworks Curator
                </h1>
                <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Select artworks and use Gemini to generate a curatorial analysis.
                </p>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <SelectionPanel
                        selectedIds={selectedIds}
                        summaryLoading={summaryLoading}
                        clearSelection={handleClearAll}
                        handleGenerateSummary={handleGenerateSummary}
                    />
                </div>
                
                <SummaryPanel
                    generatedSummary={generatedSummary}
                    summaryError={summaryError}
                    sources={sources}
                />

                <DataTable
                    artworks={artworks}
                    loading={loading}
                    totalRecords={totalRecords}
                    lazyState={lazyState}
                    onPage={onPage}
                    selectedIds={selectedIds}
                    allRowsSelected={allRowsSelected}
                    onRowSelect={onRowSelect}
                    onRowUnselect={onRowUnselect}
                    onSelectAllChange={onSelectAllChange}
                />
            </div>
        </div>
    );
};

export default App;
