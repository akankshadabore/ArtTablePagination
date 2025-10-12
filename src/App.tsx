import { useDataFetching } from './hooks/useDataFetching';
import { usePersistentSelection } from './hooks/usePersistentSelection';
import { SelectionPanel } from './components/SelectionPanel';
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-gray-900 font-sans">
            <header className="mb-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-400">
                    GrowMeOrganic Private Limited
                </h1>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <SelectionPanel
                        selectedIds={selectedIds}
                        clearSelection={clearSelection}
                    />
                </div>

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

