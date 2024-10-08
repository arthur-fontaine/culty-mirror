import { searchService } from '@culty/services';
import { useDebounce } from '@uidotdev/usehooks';
import { createRoute } from 'agrume';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const useSearch = () => {
  const [searchTerms, setSearchTerms] = useState('');
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

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
