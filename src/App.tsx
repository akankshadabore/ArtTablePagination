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
                    Artworks Curator
                </h1>
                <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Select artworks to curate and review their information.
                </p>
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












































// import React from 'react';

// // --- 1. TYPES/INTERFACES ---

// /** Defines the structure for a single Artwork item fetched from the API. */
// interface Artwork {
//     id: number;
//     title: string;
//     place_of_origin: string;
//     artist_display: string;
//     inscriptions: string | null;
//     date_start: number;
//     date_end: number;
// }
// type SelectedIds = Set<number>;

// /** Defines the structure for pagination state. */
// interface LazyState {
//     first: number; // The offset of the first record
//     rows: number;  // The number of records per page
// }

// /** Defines the structure for a citation source returned by Google Search Grounding. */
// interface Source {
//     uri: string;
//     title: string;
// }

// /** Defines the structure for the API response after generating the summary. */
// interface SummaryResponse {
//     text: string;
//     sources: Source[];
// }

// // --- 2. API SERVICES ---

// /**
//  * Utility function to handle API calls with exponential backoff for retries.
//  */
// const exponentialBackoffFetch = async (url: string, options: RequestInit, maxRetries = 5): Promise<Response> => {
//     const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
//     let error: Error | null = null;

//     for (let i = 0; i < maxRetries; i++) {
//         try {
//             const response = await fetch(url, options);
//             if (!response.ok) {
//                 if (response.status === 429 || response.status >= 500) {
//                      throw new Error(`Retryable HTTP error! status: ${response.status}`);
//                 }
//                 throw new Error(`Non-retryable HTTP error! status: ${response.status}`);
//             }
//             return response;
//         } catch (e) {
//             error = e as Error;
//             if (i < maxRetries - 1) {
//                 // Do not log retry attempts
//                 await delay(1000 * (2 ** i)); // 1s, 2s, 4s, 8s...
//             }
//         }
//     }
//     throw new Error(`Fetch failed after ${maxRetries} attempts: ${error?.message}`);
// };

// /**
//  * Fetches artwork data from the Art Institute of Chicago API with server-side pagination.
//  */
// const fetchArtworks = async (state: LazyState): Promise<{ artworks: Artwork[], totalRecords: number }> => {
//     const currentPage = Math.floor(state.first / state.rows) + 1;
//     const url = `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${state.rows}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`API error: ${response.statusText}`);
//         }
//         const data = await response.json();

//         const artworks: Artwork[] = data.data.filter((item: Artwork) => item.id !== undefined);
//         const totalRecords = data.pagination.total;

//         return { artworks, totalRecords };
//     } catch (error) {
//         console.error('Error fetching artwork data:', error);
//         return { artworks: [], totalRecords: 0 };
//     }
// };

// /**
//  * Calls the Gemini API to generate a curatorial analysis based on selected artwork IDs.
//  */
// const generateCuratorialAnalysis = async (selectedIds: SelectedIds): Promise<SummaryResponse> => {
//     const apiKey = ""; 
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

//     // Use up to 10 IDs for the prompt
//     const selectedArtworkIdsArray = Array.from(selectedIds).slice(0, 10);
//     const selectedIdsString = selectedArtworkIdsArray.join(', ');
    
//     const userQuery = `Analyze the following collection of artworks from the Art Institute of Chicago (identified by their IDs: ${selectedIdsString}) and provide a concise, single-paragraph thematic analysis. The works cover various periods and regions. Summarize the collection's overall tone, themes, or historical significance. Do not mention the IDs in the final summary.`;
    
//     const systemPrompt = "You are a world-class art historian and museum curator. Your response must be highly engaging, professional, and limited to one paragraph (maximum 5 sentences). Focus on synthesis, interpretation, and historical context.";

//     const payload = {
//         contents: [{ parts: [{ text: userQuery }] }],
//         tools: [{ "google_search": {} }],
//         systemInstruction: {
//             parts: [{ text: systemPrompt }]
//         },
//     };

//     const response = await exponentialBackoffFetch(apiUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//     });

//     const result = await response.json();
//     const candidate = result.candidates?.[0];

//     if (candidate && candidate.content?.parts?.[0]?.text) {
//         const text = candidate.content.parts[0].text;
        
//         let sources: Source[] = [];
//         const groundingMetadata = candidate.groundingMetadata;
//         if (groundingMetadata && groundingMetadata.groundingAttributions) {
//             sources = groundingMetadata.groundingAttributions
//                 .map(attribution => ({
//                     uri: attribution.web?.uri || '',
//                     title: attribution.web?.title || 'Untitled Source',
//                 }))
//                 .filter(source => source.uri);
//         }
        
//         return { text, sources };
//     } else {
//         throw new Error('Invalid response structure received from Gemini API.');
//     }
// };


// // --- 3. HOOKS ---

// /** Manages state and logic for fetching artwork data with lazy pagination. */
// const useDataFetching = () => {
//     const [artworks, setArtworks] = React.useState<Artwork[]>([]);
//     const [loading, setLoading] = React.useState<boolean>(true);
//     const [totalRecords, setTotalRecords] = React.useState<number>(0);
//     const [lazyState, setLazyState] = React.useState<LazyState>({
//         first: 0, 
//         rows: 10, 
//     });

//     const loadLazyData = React.useCallback(async (state: LazyState) => {
//         setLoading(true);
//         const { artworks: fetchedArtworks, totalRecords: fetchedTotalRecords } = await fetchArtworks(state);
        
//         setArtworks(fetchedArtworks); 
//         setTotalRecords(fetchedTotalRecords);
//         setLoading(false);
//     }, []);

//     React.useEffect(() => {
//         loadLazyData(lazyState);
//     }, [lazyState, loadLazyData]); 

//     const onPage = (event: { first: number, rows: number }) => {
//         setLazyState(event);
//     };

//     return {
//         artworks,
//         loading,
//         totalRecords,
//         lazyState,
//         onPage
//     };
// };

// /** Manages the persistent selection state across all pages of the data table. */
// const usePersistentSelection = (artworks: Artwork[]) => {
//     const [selectedIds, setSelectedIds] = React.useState<SelectedIds>(new Set());

//     const onRowSelect = (artwork: Artwork) => {
//         const id = artwork.id;
//         setSelectedIds(prev => new Set(prev).add(id));
//     };

//     const onRowUnselect = (artwork: Artwork) => {
//         const id = artwork.id;
//         setSelectedIds(prev => {
//             const newSet = new Set(prev);
//             newSet.delete(id);
//             return newSet;
//         });
//     };

//     const onSelectAllChange = (checked: boolean) => {
//         setSelectedIds(prev => {
//             const newSet = new Set(prev);
//             if (checked) {
//                 artworks.forEach(artwork => newSet.add(artwork.id));
//             } else {
//                 artworks.forEach(artwork => newSet.delete(artwork.id));
//             }
//             return newSet;
//         });
//     };

//     const allRowsSelected = React.useMemo(() => {
//         if (!artworks || artworks.length === 0) return false;
//         return artworks.every(artwork => selectedIds.has(artwork.id));
//     }, [artworks, selectedIds]);

//     const clearSelection = () => {
//         setSelectedIds(new Set());
//     };

//     return {
//         selectedIds,
//         onRowSelect,
//         onRowUnselect,
//         onSelectAllChange,
//         allRowsSelected,
//         clearSelection,
//     };
// };

// /** Manages state and logic for calling the Gemini API to generate analysis. */
// const useGeminiAnalysis = (selectedIds: SelectedIds) => {
//     const [generatedSummary, setGeneratedSummary] = React.useState<string>('');
//     const [summaryLoading, setSummaryLoading] = React.useState<boolean>(false);
//     const [summaryError, setSummaryError] = React.useState<string>('');
//     const [sources, setSources] = React.useState<Source[]>([]);

//     const handleGenerateSummary = React.useCallback(async () => {
//         if (selectedIds.size === 0) return;

//         setSummaryLoading(true);
//         setSummaryError('');
//         setGeneratedSummary('');
//         setSources([]);

//         try {
//             const { text, sources: extractedSources } = await generateCuratorialAnalysis(selectedIds);
//             setGeneratedSummary(text);
//             setSources(extractedSources);

//         } catch (error) {
//             console.error('Gemini API Error:', error);
//             setSummaryError('Failed to generate summary after multiple attempts. Please try again.');
//         } finally {
//             setSummaryLoading(false);
//         }
//     }, [selectedIds]);

//     const clearSummary = React.useCallback(() => {
//         setGeneratedSummary('');
//         setSummaryError('');
//         setSources([]);
//     }, []);

//     return {
//         generatedSummary,
//         summaryLoading,
//         summaryError,
//         sources,
//         handleGenerateSummary,
//         clearSummary
//     };
// };

// // --- 4. COMPONENTS ---

// /** A simple Tailwind CSS-based loading spinner. */
// const Spinner: React.FC = () => (
//     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//     </svg>
// );

// // --- Pagination Component ---
// interface PaginationProps {
//     lazyState: LazyState;
//     totalRecords: number;
//     onPage: (event: { first: number, rows: number }) => void;
//     loading: boolean;
// }
// const Pagination: React.FC<PaginationProps> = ({ lazyState, totalRecords, onPage, loading }) => {
//     const { first, rows } = lazyState;
//     const currentPage = Math.floor(first / rows) + 1;
//     const totalPages = Math.ceil(totalRecords / rows);
//     const hasPrev = currentPage > 1;
//     const hasNext = currentPage < totalPages;

//     const changePage = (page: number) => {
//         const newFirst = (page - 1) * rows;
//         onPage({ first: newFirst, rows });
//     };

//     const pageLinks = [];
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, currentPage + 2);

//     if (currentPage <= 3) {
//         endPage = Math.min(totalPages, 5);
//         startPage = 1;
//     } else if (currentPage > totalPages - 2) {
//         startPage = Math.max(1, totalPages - 4);
//         endPage = totalPages;
//     }
    
//     if (totalPages > 0) {
//         for (let i = startPage; i <= endPage; i++) {
//             pageLinks.push(
//                 <button
//                     key={i}
//                     className={`mx-1 px-3 py-1 text-sm rounded-lg transition-colors duration-150 shadow-md ${
//                         i === currentPage 
//                             ? 'bg-indigo-600 text-white font-bold' 
//                             : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-indigo-900'
//                     } disabled:opacity-50`}
//                     onClick={() => changePage(i)}
//                     disabled={loading || i === currentPage}
//                 >
//                     {i}
//                 </button>
//             );
//         }
//     }

//     const rowsPerPageOptions = [10, 20, 50];

//     return (
//         <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-b-xl border-t dark:border-gray-700 flex-wrap gap-3">
//             <div className="text-sm text-gray-700 dark:text-gray-300 min-w-[200px]">
//                 Showing {first + 1} to {Math.min(first + rows, totalRecords)} of {totalRecords} entries
//             </div>

//             <div className="flex items-center space-x-2 flex-wrap">
//                 <select
//                     className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm shadow-md"
//                     value={rows}
//                     onChange={(e) => onPage({ first: 0, rows: Number(e.target.value) })}
//                     disabled={loading}
//                 >
//                     {rowsPerPageOptions.map(option => (
//                         <option key={option} value={option}>{option} rows</option>
//                     ))}
//                 </select>

//                 <button
//                     className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150 shadow-md disabled:opacity-50"
//                     onClick={() => changePage(currentPage - 1)}
//                     disabled={!hasPrev || loading}
//                 >
//                     &lt; Prev
//                 </button>

//                 <div className="flex space-x-1">
//                     {pageLinks}
//                 </div>

//                 <button
//                     className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150 shadow-md disabled:opacity-50"
//                     onClick={() => changePage(currentPage + 1)}
//                     disabled={!hasNext || loading}
//                 >
//                     Next &gt;
//                 </button>
//             </div>
//         </div>
//     );
// };


// // --- Selection Panel Component ---
// interface SelectionPanelProps {
//     selectedIds: SelectedIds;
//     summaryLoading: boolean;
//     clearSelection: () => void;
//     handleGenerateSummary: () => Promise<void>;
// }
// const SelectionPanel: React.FC<SelectionPanelProps> = ({ 
//     selectedIds, 
//     summaryLoading, 
//     clearSelection, 
//     handleGenerateSummary,
// }) => {
    
//     return (
//         <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
//             <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
//                 Persistent Selection Status
//             </h3>
//             <p className="text-gray-600 dark:text-gray-300">
//                 Total Artworks Selected: <span className="font-bold text-xl text-purple-600 dark:text-purple-400">{selectedIds.size}</span>
//             </p>
            
//             <div className="flex flex-wrap gap-3 mt-4">
//                  <button
//                     className={`px-5 py-2 text-white font-medium rounded-lg shadow-lg transition duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] ${
//                         selectedIds.size > 0 && !summaryLoading
//                             ? 'bg-purple-600 hover:bg-purple-700'
//                             : 'bg-purple-400 cursor-not-allowed opacity-70'
//                     }`}
//                     onClick={handleGenerateSummary}
//                     disabled={selectedIds.size === 0 || summaryLoading}
//                 >
//                     {summaryLoading ? (
//                         <>
//                             <Spinner />
//                             <span className="ml-2">Analyzing...</span>
//                         </>
//                     ) : (
//                         <>
//                             <span className="mr-2 text-lg">✨</span> Analyze Collection ({Math.min(selectedIds.size, 10)} IDs)
//                         </>
//                     )}
//                 </button>
                
//                 <button
//                     className="px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
//                     onClick={clearSelection}
//                 >
//                     Clear All Selections
//                 </button>
//             </div>
            
//         </div>
//     );
// };


// // --- Summary Panel Component ---
// interface SummaryPanelProps {
//     generatedSummary: string;
//     summaryError: string;
//     sources: Source[];
// }
// const SummaryPanel: React.FC<SummaryPanelProps> = ({ generatedSummary, summaryError, sources }) => {
    
//     if (!generatedSummary && !summaryError) {
//         return null;
//     }

//     return (
//         <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-purple-200 dark:border-purple-900">
//             <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center">
//                 <span className="mr-2 text-3xl">💡</span> Curatorial Analysis
//             </h3>
            
//             {summaryError ? (
//                 <p className="text-red-500 font-medium p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{summaryError}</p>
//             ) : (
//                 <>
//                     <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
//                         {generatedSummary}
//                     </p>
                    
//                     {sources.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                             <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
//                                 Grounding Sources:
//                             </p>
//                             <ul className="list-disc list-inside text-sm text-indigo-500 dark:text-indigo-300 space-y-1">
//                                 {sources.map((source, index) => (
//                                     <li key={index} className="truncate">
//                                         <a 
//                                             href={source.uri} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                             title={source.title}
//                                             className="hover:underline"
//                                         >
//                                             {source.title}
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };


// // --- Data Table Component ---
// interface DataTableProps {
//     artworks: Artwork[];
//     loading: boolean;
//     totalRecords: number;
//     lazyState: LazyState;
//     onPage: (event: { first: number, rows: number }) => void;
//     selectedIds: Set<number>;
//     allRowsSelected: boolean;
//     onRowSelect: (artwork: Artwork) => void;
//     onRowUnselect: (artwork: Artwork) => void;
//     onSelectAllChange: (checked: boolean) => void;
// }
// const DataTable: React.FC<DataTableProps> = ({
//     artworks,
//     loading,
//     totalRecords,
//     lazyState,
//     onPage,
//     selectedIds,
//     allRowsSelected,
//     onRowSelect,
//     onRowUnselect,
//     onSelectAllChange,
// }) => {
    
//     const handleRowClick = (artwork: Artwork) => {
//         const isSelected = selectedIds.has(artwork.id);
//         if (isSelected) {
//             onRowUnselect(artwork);
//         } else {
//             onRowSelect(artwork);
//         }
//     };

//     return (
//         <div className="mt-8 shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700">
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-indigo-50 dark:bg-indigo-900/50">
//                         <tr>
//                             {/* Selection Header */}
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider w-12">
//                                 <input
//                                     type="checkbox"
//                                     className="form-checkbox h-4 w-4 text-indigo-600 rounded"
//                                     checked={allRowsSelected}
//                                     onChange={(e) => onSelectAllChange(e.target.checked)}
//                                     disabled={loading}
//                                 />
//                             </th>
//                             {/* Headers */}
//                             {['Title', 'Artist', 'Origin', 'Inscriptions', 'Start Date', 'End Date'].map(header => (
//                                 <th 
//                                     key={header} 
//                                     className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-default"
//                                 >
//                                     {header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {artworks.map((artwork) => {
//                             const isSelected = selectedIds.has(artwork.id);
//                             return (
//                                 <tr 
//                                     key={artwork.id} 
//                                     className={`hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''}`}
//                                     onClick={() => handleRowClick(artwork)}
//                                 >
//                                     {/* Checkbox Cell */}
//                                     <td className="px-4 py-4 whitespace-nowrap w-12 text-center">
//                                         <input
//                                             type="checkbox"
//                                             className="form-checkbox h-4 w-4 text-indigo-600 rounded pointer-events-none"
//                                             checked={isSelected}
//                                             readOnly 
//                                         />
//                                     </td>
//                                     {/* Data Cells */}
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate max-w-xs">{artwork.title}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{artwork.artist_display}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{artwork.place_of_origin}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs overflow-hidden truncate">{artwork.inscriptions || 'N/A'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{artwork.date_start}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{artwork.date_end}</td>
//                                 </tr>
//                             );
//                         })}
//                         {/* Empty state or Loading state row */}
//                             {!loading && artworks.length === 0 && (
//                             <tr>
//                                 <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">No artworks found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Custom Pagination Component */}
//             <Pagination 
//                 lazyState={lazyState} 
//                 totalRecords={totalRecords} 
//                 onPage={onPage} 
//                 loading={loading} 
//             />
            
//              {/* Loading Spinner Overlay */}
//             {loading && (
//                 <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex justify-center items-center z-20 rounded-xl">
//                     <div className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//             )}
//         </div>
//     );
// };


// // --- 5. MAIN APP COMPONENT ---

// /**
//  * Main application component. It hooks into all custom logic and orchestrates the UI components.
//  */
// export default function App() {
//     // 1. Data Fetching Logic (API calls and pagination state)
//     const { 
//         artworks, 
//         loading, 
//         totalRecords, 
//         lazyState, 
//         onPage 
//     } = useDataFetching();

//     // 2. Persistent Selection Logic
//     const {
//         selectedIds,
//         onRowSelect,
//         onRowUnselect,
//         onSelectAllChange,
//         allRowsSelected,
//         clearSelection,
//     } = usePersistentSelection(artworks);
    
//     // 3. Gemini Analysis Logic
//     const {
//         generatedSummary,
//         summaryLoading,
//         summaryError,
//         sources,
//         handleGenerateSummary,
//         clearSummary,
//     } = useGeminiAnalysis(selectedIds);

//     // Function to clear both selection and summary simultaneously
//     const handleClearAll = () => {
//         clearSelection();
//         clearSummary();
//     };


//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-gray-900 font-sans">
//             {/* Tailwind CSS CDN: Ensures styling works */}
//             <script src="https://cdn.tailwindcss.com"></script>
//             <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//             <header className="mb-8 text-center">
//                 <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-400">
//                     Artworks Curator
//                 </h1>
//                 <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
//                     Select artworks and use Gemini to generate a curatorial analysis.
//                 </p>
//             </header>

//             <div className="max-w-7xl mx-auto">
                
//                 {/* 1. Selection and Control Panel */}
//                 <div className="mb-6">
//                     <SelectionPanel
//                         selectedIds={selectedIds}
//                         summaryLoading={summaryLoading}
//                         clearSelection={handleClearAll}
//                         handleGenerateSummary={handleGenerateSummary}
//                     />
//                 </div>
                
//                 {/* 2. Gemini Analysis Summary Panel */}
//                 <SummaryPanel
//                     generatedSummary={generatedSummary}
//                     summaryError={summaryError}
//                     sources={sources}
//                 />

//                 {/* 3. Main Data Table */}
//                 <DataTable
//                     artworks={artworks}
//                     loading={loading}
//                     totalRecords={totalRecords}
//                     lazyState={lazyState}
//                     onPage={onPage}
//                     selectedIds={selectedIds}
//                     allRowsSelected={allRowsSelected}
//                     onRowSelect={onRowSelect}
//                     onRowUnselect={onRowUnselect}
//                     onSelectAllChange={onSelectAllChange}
//                 />
//             </div>
//         </div>
//     );
// };
