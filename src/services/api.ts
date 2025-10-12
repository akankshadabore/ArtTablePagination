import type { Artwork, LazyState} from '../types';


export const exponentialBackoffFetch = async (
    url: string, 
    options: RequestInit, 
    maxRetries = 5
): Promise<Response> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    let error: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`Retryable HTTP error! status: ${response.status}`);
                }
                throw new Error(`Non-retryable HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (e) {
            error = e as Error;
            if (i < maxRetries - 1) {
                await delay(1000 * (2 ** i)); 
            }
        }
    }
    throw new Error(`Fetch failed after ${maxRetries} attempts: ${error?.message}`);
};


export const fetchArtworks = async (
    state: LazyState
): Promise<{ artworks: Artwork[], totalRecords: number }> => {
    const currentPage = Math.floor(state.first / state.rows) + 1;
    const url = `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${state.rows}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();

        const artworks: Artwork[] = data.data.filter((item: Artwork) => item.id !== undefined);
        const totalRecords = data.pagination.total;

        return { artworks, totalRecords };
    } catch (error) {
        console.error('Error fetching artwork data:', error);
        return { artworks: [], totalRecords: 0 };
    }
};
