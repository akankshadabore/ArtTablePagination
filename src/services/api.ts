import type { Artwork, LazyState, SelectedIds, SummaryResponse, Source } from '../types';


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


export const generateCuratorialAnalysis = async (
    selectedIds: SelectedIds
): Promise<SummaryResponse> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
    
    if (!apiKey) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const selectedArtworkIdsArray = Array.from(selectedIds).slice(0, 10);
    const selectedIdsString = selectedArtworkIdsArray.join(', ');
    
    const userQuery = `Analyze the following collection of artworks from the Art Institute of Chicago (identified by their IDs: ${selectedIdsString}) and provide a concise, single-paragraph thematic analysis. The works cover various periods and regions. Summarize the collection's overall tone, themes, or historical significance. Do not mention the IDs in the final summary.`;
    
    const systemPrompt = "You are a world-class art historian and museum curator. Your response must be highly engaging, professional, and limited to one paragraph (maximum 5 sentences). Focus on synthesis, interpretation, and historical context.";

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    const response = await exponentialBackoffFetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;
        
        let sources: Source[] = [];
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
            sources = groundingMetadata.groundingAttributions
                .map((attribution: any) => ({
                    uri: attribution.web?.uri || '',
                    title: attribution.web?.title || 'Untitled Source',
                }))
                .filter((source: Source) => source.uri);
        }
        
        return { text, sources };
    } else {
        throw new Error('Invalid response structure received from Gemini API.');
    }
};