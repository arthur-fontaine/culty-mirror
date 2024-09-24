import { useDebounce } from '@uidotdev/usehooks';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const useSearch = () => {
  const [searchTerms, setSearchTerms] = useState('');
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  const { data, isLoading } = useQuery(
    ['search', debouncedSearchTerms],
    async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?q=${debouncedSearchTerms}`
      );
      return response.json();
    }
  );

  return {
    searchTerms,
    setSearchTerms,
    data,
    isLoading,
  };
};
