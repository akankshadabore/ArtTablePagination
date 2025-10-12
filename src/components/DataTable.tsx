import type { Artwork, LazyState } from '../types';
import { Pagination } from './Pagination';

interface DataTableProps {
    artworks: Artwork[];
    loading: boolean;
    totalRecords: number;
    lazyState: LazyState;
    onPage: (event: { first: number, rows: number }) => void;
    selectedIds: Set<number>;
    allRowsSelected: boolean;
    onRowSelect: (artwork: Artwork) => void;
    onRowUnselect: (artwork: Artwork) => void;
    onSelectAllChange: (checked: boolean) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
    artworks,
    loading,
    totalRecords,
    lazyState,
    onPage,
    selectedIds,
    allRowsSelected,
    onRowSelect,
    onRowUnselect,
    onSelectAllChange,
}) => {
    const handleRowClick = (artwork: Artwork) => {
        const isSelected = selectedIds.has(artwork.id);
        if (isSelected) {
            onRowUnselect(artwork);
        } else {
            onRowSelect(artwork);
        }
    };

    return (
        <div className="mt-8 shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700">
            <div className="w-full overflow-x-hidden">
                <table className="table-fixed w-full border-collapse">
                    <thead className="bg-indigo-50 dark:bg-indigo-900/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-12">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                                    checked={allRowsSelected}
                                    onChange={(e) => onSelectAllChange(e.target.checked)}
                                    disabled={loading}
                                />
                            </th>
                            <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Artist</th>
                            <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Origin</th>
                            <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Inscriptions</th>
                            <th className="w-1/10 px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                            <th className="w-1/10 px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">End Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {artworks.map((artwork) => {
                            const isSelected = selectedIds.has(artwork.id);
                            return (
                                <tr 
                                    key={artwork.id} 
                                    className={`hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}`}
                                    onClick={() => handleRowClick(artwork)}
                                >
                                    <td className="px-4 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-indigo-600 rounded pointer-events-none"
                                            checked={isSelected}
                                            readOnly 
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{artwork.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{artwork.artist_display}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{artwork.place_of_origin}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{artwork.inscriptions || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{artwork.date_start}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{artwork.date_end}</td>
                                </tr>
                            );
                        })}
                        {!loading && artworks.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                                    No artworks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                lazyState={lazyState} 
                totalRecords={totalRecords} 
                onPage={onPage} 
                loading={loading} 
            />
            
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex justify-center items-center z-20 rounded-xl">
                    <div className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};