import { useState, useEffect, useCallback } from 'react';
import { algoliasearch, SearchClient } from 'algoliasearch';

interface SearchResult {
  objectID: string;
  title: string;
  description?: string;
  excerpt: string;
  slug: string;
  locale: string;
  type: 'post' | 'page';
  tags?: string[];
  publishedDate?: string;
  url: string;
  _highlightResult?: {
    title?: {
      value: string;
    };
    description?: {
      value: string;
    };
    content?: {
      value: string;
    };
  };
}

interface UseAlgoliaSearchResult {
  results: SearchResult[];
  isSearching: boolean;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  error: string | null;
}

let clientInstance: SearchClient | null = null;

function getAlgoliaClient(): SearchClient | null {
  if (clientInstance) {
    return clientInstance;
  }

  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    return null;
  }

  clientInstance = algoliasearch(appId, searchApiKey);
  return clientInstance;
}

export function useAlgoliaSearch(locale?: string): UseAlgoliaSearchResult {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const client = getAlgoliaClient();
      const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

      if (!client || !indexName) {
        setError('Algolia is not configured');
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const { results: searchResults } = await client.search({
          requests: [
            {
              indexName,
              query,
              filters: locale ? `locale:${locale}` : undefined,
              hitsPerPage: 10,
            },
          ],
        });

        const hits = ('hits' in searchResults[0] ? searchResults[0].hits : []) as SearchResult[];
        setResults(hits);
      } catch (err) {
        console.error('Algolia search error:', err);
        setError('Failed to search');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [locale]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isSearching,
    search,
    clearResults,
    error,
  };
}
