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
  });

  return {
    searchTerms,
    setSearchTerms,
    data,
    isLoading,
  };
};
