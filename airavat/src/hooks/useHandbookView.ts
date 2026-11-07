import { useState, useEffect, useMemo } from "react";
import { createApiInstance, ISiteInfo } from "@sankhyatronics/apiclient";

interface IViewColumn {
    name: string;
    displayName: string;
}

interface IUseHandbookViewProps {
    api: ReturnType<typeof createApiInstance>;
    sources: ISiteInfo[];
}

export const useHandbookView = ({ api, sources }: IUseHandbookViewProps) => {
    const [commonColumns, setCommonColumns] = useState<IViewColumn[]>([]);
    const [selectedView, setSelectedView] = useState<{ key: string; label: string } | null>(null);

    const loadCommonColumns = async () => {
        if (!sources || sources.length === 0) return;

        try {
            const columns = await api.columns.getListCommonColumns(sources, { internalNameStartswith: "hb" });
            setCommonColumns(columns);

            // Set initial selected view only if not already set or invalid
            if (columns.length > 0) {
                // Check if current view is valid
                const isCurrentValid = selectedView && columns.some(c => c.name === selectedView.key);

                if (!selectedView || !isCurrentValid) {
                    const firstColumn = columns[0];
                    setSelectedView({
                        key: firstColumn.name,
                        label: firstColumn.displayName
                    });
                }
            }
        } catch (error) {
            console.error("Failed to load common columns:", error);
            setCommonColumns([]);
        }
    };

    // Load initial columns
    useEffect(() => {
        loadCommonColumns();
    }, [sources, api]);

    const onViewChange = (viewKey: string) => {
        const column = commonColumns.find(col => col.name === viewKey);
        const viewLabel = column?.displayName || viewKey;
        setSelectedView({ key: viewKey, label: viewLabel });
    };

    const modifiedSources = useMemo(() => {
        return sources.map(source => ({
            ...source,
            parentField: selectedView?.key || source.parentField
        }));
    }, [sources, selectedView]);

    return {
        commonColumns,
        selectedView,
        setSelectedView,
        modifiedSources,
        loadCommonColumns,
        onViewChange
    };
};
