import { Text, View } from "react-native";
import { SearchIcon } from "../shared/components/icons/search-icon";
import { UITextInput } from "../shared/components/text-input";
import { DefaultLayout } from "../shared/layouts/default-layout";
import { createUseStyles } from "../shared/theme/create-use-styles";
import { SearchResult } from "./components/search-result";
import { useSearch } from "./hooks/use-search";

export const SearchPage = () => {
  const { styles } = useStyles();
  const { data, isLoading, searchTerms, setSearchTerms } = useSearch();

  return <DefaultLayout>
    <View style={styles.textInput}>
      <UITextInput
        placeholder="Search"
        value={searchTerms}
        onChangeText={setSearchTerms}
        icon={SearchIcon}
      />
    </View>
    {isLoading && <Text>Loading...</Text>}
    {data && (
      <View>
        {data.results.map((post, i) => (
          <SearchResult
            key={post.resultId}
            id={post.resultId}
            isBestResult={i === 0}
            {...post}
          />
        ))}
      </View>
    )}
  </DefaultLayout>;
};

const useStyles = createUseStyles((theme) => ({
  textInput: {
    marginBottom: theme.spacing.vertical.betweenDifferentElements - (theme.spacing.vertical.insideGroup / 2), // we substract insideGroup/2 because the first result already has a margin top
  },
}))
