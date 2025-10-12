import { useState, useMemo } from 'react';
import type { Artwork, SelectedIds } from '../types';


export const usePersistentSelection = (artworks: Artwork[]) => {
    const [selectedIds, setSelectedIds] = useState<SelectedIds>(new Set());

    const onRowSelect = (artwork: Artwork) => {
        const id = artwork.id;
        setSelectedIds(prev => new Set(prev).add(id));
    };

    const onRowUnselect = (artwork: Artwork) => {
        const id = artwork.id;
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };

    const onSelectAllChange = (checked: boolean) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (checked) {
                artworks.forEach(artwork => newSet.add(artwork.id));
            } else {
                artworks.forEach(artwork => newSet.delete(artwork.id));
            }
            return newSet;
        });
    };

    const allRowsSelected = useMemo(() => {
        if (!artworks || artworks.length === 0) return false;
        return artworks.every(artwork => selectedIds.has(artwork.id));
    }, [artworks, selectedIds]);

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    return {
        selectedIds,
        onRowSelect,
        onRowUnselect,
        onSelectAllChange,
        allRowsSelected,
        clearSelection,
    };
};