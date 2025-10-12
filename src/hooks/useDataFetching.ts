import { useState, useCallback, useEffect } from 'react';
import type { Artwork, LazyState } from '../types';
import { fetchArtworks } from '../services/api';


export const useDataFetching = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lazyState, setLazyState] = useState<LazyState>({
        first: 0,
        rows: 10,
    });

    const loadLazyData = useCallback(async (state: LazyState) => {
        setLoading(true);
        const { artworks: fetchedArtworks, totalRecords: fetchedTotalRecords } = await fetchArtworks(state);

        setArtworks(fetchedArtworks);
        setTotalRecords(fetchedTotalRecords);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadLazyData(lazyState);
    }, [lazyState, loadLazyData]);

    const onPage = (event: { first: number, rows: number }) => {
        setLazyState(event);
    };

    return {
        artworks,
        loading,
        totalRecords,
        lazyState,
        onPage
    };
};
