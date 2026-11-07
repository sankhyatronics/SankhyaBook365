import { useMemo } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { createApiInstance, SitePage, TokenProvider } from "@sankhyatronics/apiclient";
import { ISiteInfo } from "@sankhyatronics/apiclient";

export function usePagedPagesBatch({ tokenProvider, sources, pageSize = 20, }: {
  tokenProvider: TokenProvider;
  sources: ISiteInfo[];
  pageSize?: number;
}) {
  const api = useMemo(() => createApiInstance({ getToken: tokenProvider }), [tokenProvider]);


  const queryClient = useQueryClient();

  if (!sources || sources.length === 0) {
    return [];
  }

  return sources.map((source) => {
    const queryKey = [
      "sitePages",
      source.webUrl,
      source.listId,
      source.parentField,
      pageSize,
    ];

    const query = useInfiniteQuery({
      queryKey,
      enabled: !!(
        source.webUrl &&
        source.listId &&
        source.parentField
      ),
      queryFn: async ({ pageParam }) => {
        // 🔹 Cached SP IDs (fetch once per site)
        const spIds = await queryClient.fetchQuery({
          queryKey: ["spIds", source.webUrl],
          queryFn: () =>
            api.sites.resolveSharePointIds(source.webUrl),
          staleTime: Infinity,
          cacheTime: Infinity,
        });

        if (source.listId === undefined) { throw new Error('listId is undefined'); }
        if (source.parentField === undefined) { throw new Error('parentField is undefined'); }

        const res = await api.sitePages.getPages({
          siteId: spIds.siteId,
          listId: source.listId,
          parentField: source.parentField,
          top: pageSize,
          nextLink: pageParam ?? "",
        });

        return {
          items: (res.items ?? []) as SitePage[],
          nextLink: res.nextLink ?? null,
        };
      },
      getNextPageParam: (last) => last.nextLink ?? undefined,

      // ⭐ caching tuned for content
      staleTime: 15 * 60 * 1000,
      cacheTime: 2 * 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
    });

    const items =
      query.data?.pages.flatMap((p) => p.items) ?? [];

    return {
      items,
      loadingInitial: query.isLoading,
      loadingMore: query.isFetchingNextPage,
      hasMore: !!query.hasNextPage,
      error: query.error ? String(query.error) : null,

      loadMore: async () => {
        if (query.hasNextPage) {
          await query.fetchNextPage();
        }
      },

      reload: async () => {
        await queryClient.invalidateQueries({ queryKey });
      },
    };
  });
}
