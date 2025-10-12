import type { LazyState } from '../types';

interface PaginationProps {
    lazyState: LazyState;
    totalRecords: number;
    onPage: (event: { first: number, rows: number }) => void;
    loading: boolean;
}


export const Pagination: React.FC<PaginationProps> = ({ 
    lazyState, 
    totalRecords, 
    onPage, 
    loading 
}) => {
    const { first, rows } = lazyState;
    const currentPage = Math.floor(first / rows) + 1;
    const totalPages = Math.ceil(totalRecords / rows);
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const changePage = (page: number) => {
        const newFirst = (page - 1) * rows;
        onPage({ first: newFirst, rows });
    };

    const pageLinks = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
        startPage = 1;
    } else if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }
    
    if (totalPages > 0) {
        for (let i = startPage; i <= endPage; i++) {
            pageLinks.push(
                <button
                    key={i}
                    className={`mx-1 px-3 py-1 text-sm rounded-lg transition-colors duration-150 shadow-md ${
                        i === currentPage 
                            ? 'bg-indigo-600 text-white font-bold' 
                            : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-indigo-900'
                    } disabled:opacity-50`}
                    onClick={() => changePage(i)}
                    disabled={loading || i === currentPage}
                >
                    {i}
                </button>
            );
        }
    }

    const rowsPerPageOptions = [10, 20, 50];

    return (
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-b-xl border-t dark:border-gray-700 flex-wrap gap-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 min-w-[200px]">
                Showing {first + 1} to {Math.min(first + rows, totalRecords)} of {totalRecords} entries
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
                <select
                    className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm shadow-md"
                    value={rows}
                    onChange={(e) => onPage({ first: 0, rows: Number(e.target.value) })}
                    disabled={loading}
                >
                    {rowsPerPageOptions.map(option => (
                        <option key={option} value={option}>{option} rows</option>
                    ))}
                </select>

                <button
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150 shadow-md disabled:opacity-50"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={!hasPrev || loading}
                >
                    &lt; Prev
                </button>

                <div className="flex space-x-1">
                    {pageLinks}
                </div>

                <button
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150 shadow-md disabled:opacity-50"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={!hasNext || loading}
                >
                    Next &gt;
                </button>
            </div>
        </div>
    );
};