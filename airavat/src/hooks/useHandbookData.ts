import { useCallback, useState } from "react";
import { SitePage, ISiteInfo, TokenProvider } from "@sankhyatronics/apiclient";
import { usePagedPagesBatch } from "../hooks/usePagedPagesBatch";

interface IUseHandbookDataProps {
    tokenProvider: TokenProvider;
    sources: ISiteInfo[];
    pageSize: number;
}

export const useHandbookData = ({ tokenProvider, sources, pageSize }: IUseHandbookDataProps) => {
    const [overrides, setOverrides] = useState<Record<number, SitePage[]>>({});
    const [loading, setLoading] = useState(false);

    const hookResults = usePagedPagesBatch({
        tokenProvider,
        sources,
        pageSize,
    });

    const reloadAll = useCallback(async (
        refreshColumns: () => Promise<void>
    ) => {
        setLoading(true);
        setOverrides({});

        try {
            const reloadPromises = hookResults
                .filter(r => r.reload)
                .map(r => r.reload!());

            await Promise.all([
                refreshColumns(),
                ...reloadPromises
            ]);
        } catch (error) {
            console.error("Failed to reload data:", error);
        } finally {
            setLoading(false);
        }
    }, [hookResults]);

    const getItemsFor = useCallback((idx: number) => {
        return overrides[idx] ?? hookResults[idx]?.items ?? [];
    }, [overrides, hookResults]);

    const updateOverride = useCallback((idx: number, items: SitePage[]) => {
        setOverrides(prev => ({ ...prev, [idx]: items }));
    }, []);

    return {
        hookResults,
        overrides,
        setOverrides,
        loading,
        setLoading,
        reloadAll,
        getItemsFor,
        updateOverride
    };
};
