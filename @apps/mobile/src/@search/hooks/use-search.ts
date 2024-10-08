import { searchService } from '@culty/services';
import { useDebounce } from '@uidotdev/usehooks';
import { createRoute } from 'agrume';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export const useSearch = () => {
  const { query } = useGlobalSearchParams<{
    query: string;
  }>();

  const [searchTerms, setSearchTerms] = useState(typeof query === 'string' ? query : '');
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  const navigator = useNavigation();

  useEffect(() => {
    navigator.setParams({ query: searchTerms } as never);
  }, [searchTerms, navigator]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedSearchTerms],
    queryFn: () => createRoute(async (query: string) => searchService.search({ query }))(debouncedSearchTerms),
    select: (data) => ({
      ...data,
      results: data.results.map((result) => ({
        ...result,
        releaseDate: new Date(result.releaseDate),
      })),
    }),
  });

  return {
    searchTerms,
    setSearchTerms,
    data,
    isLoading,
  };
};
