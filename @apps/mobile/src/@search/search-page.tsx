import { Text, View } from "react-native";
import { UITextInput } from "../shared/components/text-input";
import { DefaultLayout } from "../shared/layouts/default-layout";
import { createUseStyles } from "../shared/theme/create-use-styles";
import { useSearch } from "./hooks/use-search";
import { SearchIcon } from "../shared/components/icons/search-icon";
import { SearchResult } from "./components/search-result";

export const SearchPage = () => {
  const { styles } = useStyles();
  const { data, isLoading, searchTerms, setSearchTerms } = useSearch();

  return <DefaultLayout>
    <UITextInput
      placeholder="Search"
      value={searchTerms}
      onChangeText={setSearchTerms}
      icon={SearchIcon}
    />
    {isLoading && <Text>Loading...</Text>}
    {data && (
      <View>
        {data.results.map((post, i) => (
          <SearchResult
            key={post.resultId}
            id={post.resultId}
            title={post.title}
            description={post.description}
            isBestResult={i === 0}
            releaseDate={new Date(post.releaseDate)}
            image={post.image}
            categories={post.categories}
          />
        ))}
      </View>
    )}
  </DefaultLayout>;
};

const useStyles = createUseStyles((theme) => ({
}))
