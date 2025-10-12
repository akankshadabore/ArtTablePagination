
export interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string | null;
    date_start: number;
    date_end: number;
}

export type SelectedIds = Set<number>;

export interface LazyState {
    first: number; 
    rows: number;  
}

export interface Source {
    uri: string;
    title: string;
}

export interface SummaryResponse {
    text: string;
    sources: Source[];
}