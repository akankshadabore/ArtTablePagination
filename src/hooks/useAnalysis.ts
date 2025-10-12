import { useState, useCallback } from 'react';
import type { SelectedIds, Source } from '../types';
import { generateCuratorialAnalysis } from '../services/api';


export const useGeminiAnalysis = (selectedIds: SelectedIds) => {
    const [generatedSummary, setGeneratedSummary] = useState<string>('');
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    const [summaryError, setSummaryError] = useState<string>('');
    const [sources, setSources] = useState<Source[]>([]);

    const handleGenerateSummary = useCallback(async () => {
        if (selectedIds.size === 0) return;

        setSummaryLoading(true);
        setSummaryError('');
        setGeneratedSummary('');
        setSources([]);

        try {
            const { text, sources: extractedSources } = await generateCuratorialAnalysis(selectedIds);
            setGeneratedSummary(text);
            setSources(extractedSources);
        } catch (error) {
            console.error('Gemini API Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate summary after multiple attempts. Please try again.';
            setSummaryError(errorMessage);
        } finally {
            setSummaryLoading(false);
        }
    }, [selectedIds]);

    const clearSummary = useCallback(() => {
        setGeneratedSummary('');
        setSummaryError('');
        setSources([]);
    }, []);

    return {
        generatedSummary,
        summaryLoading,
        summaryError,
        sources,
        handleGenerateSummary,
        clearSummary
    };
};