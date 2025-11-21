import { useEffect, useState } from 'react';
import { algoliasearch } from 'algoliasearch';

interface SearchHit {
  objectID: string;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  tags: string[];
  locale: string;
  publishedDate: number;
  readingTime: number;
  _highlightResult?: {
    title?: { value: string };
    description?: { value: string };
    excerpt?: { value: string };
  };
}

export function useAlgoliaSearch(query: string, locale: string) {
  const [results, setResults] = useState<SearchHit[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check if environment variables are available
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

    if (!appId || !searchApiKey || !indexName) {
      console.error('Missing Algolia environment variables:', {
        appId: !!appId,
        searchApiKey: !!searchApiKey,
        indexName: !!indexName,
      });
      return;
    }

    if (!query || query.length < 2) {
      setResults([]);
      setTags([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const searchPosts = async () => {
      try {
        const client = algoliasearch(appId, searchApiKey);

        const { results: searchResults } = await client.search({
          requests: [
            {
              indexName,
              query,
              filters: `locale:${locale}`,
              hitsPerPage: 5,
              attributesToRetrieve: [
                'objectID',
                'slug',
                'title',
                'description',
                'excerpt',
                'tags',
                'locale',
                'publishedDate',
                'readingTime',
              ],
            },
          ],
        });

        const hits = ('hits' in searchResults[0] ? (searchResults[0].hits as SearchHit[]) : []) || [];

        // Extract unique tags from results
        const allTags = hits.flatMap((hit) => hit.tags || []);
        const uniqueTags = Array.from(new Set(allTags))
          .filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);

        setResults(hits);
        setTags(uniqueTags);
      } catch (error) {
        setResults([]);
        setTags([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchPosts, 1000);
    return () => clearTimeout(timeoutId);
  }, [query, locale]);

  return { results, tags, isSearching };
}
