import { useState, useMemo } from 'react';
import type { PageBasics, SitePage } from '@sankhyatronics/apiclient';

type PageArrayItem = SitePage | PageBasics;

interface UsePageSearchProps {
  pages: PageArrayItem[];
}

interface UsePageSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredPages: PageArrayItem[];
}

/**
 * Hook for filtering pages based on search query
 */
export function usePageSearch({ pages }: UsePageSearchProps): UsePageSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;

    const query = searchQuery.toLowerCase();
    return pages.filter((item) => {
      const page = 'page' in item && item.page ? item.page : item as PageBasics;
      return page?.title?.toLowerCase().includes(query) ||
        page?.description?.toLowerCase().includes(query);
    });
  }, [pages, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPages,
  };
}
