import { Text } from "react-native";
import { SearchIcon } from "../shared/components/icons/search-icon";
import { UITextInput } from "../shared/components/text-input";
import { DefaultLayout } from "../shared/layouts/default-layout";
import { SearchResult } from "./components/search-result";
import { useSearch } from "./hooks/use-search";
import { UIGroup } from "../shared/components/group/group";

export const SearchPage = () => {
  const { data, isLoading, searchTerms, setSearchTerms } = useSearch();

  return <DefaultLayout>
    <UIGroup>
      <UITextInput
        placeholder="Search"
        value={searchTerms}
        onChangeText={setSearchTerms}
        icon={SearchIcon}
      />
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <UIGroup>
          {data.results.map((post, i) => (
            <SearchResult
              key={post.resultId}
              id={post.resultId}
              isBestResult={i === 0}
              {...post}
            />
          ))}
        </UIGroup>
      )}
    </UIGroup>
  </DefaultLayout>;
};
