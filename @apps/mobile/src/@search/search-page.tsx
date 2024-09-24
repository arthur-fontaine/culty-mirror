import { Text, TextInput, View } from "react-native";
import { createUseStyles } from "../shared/theme/create-use-styles";
import { useSearch } from "./hooks/use-search";

export const SearchPage = () => {
  const { styles } = useStyles();
  const { data, isLoading, searchTerms, setSearchTerms } = useSearch();

  return <View
    style={styles.view}
  >
    <TextInput
      placeholder="Search"
      value={searchTerms}
      onChangeText={setSearchTerms}
    />
    {isLoading && <Text>Loading...</Text>}
    {data && (
      <View>
        {data.results.map((post) => (
          <Text key={post.resultId}>{post.resultId}</Text>
        ))}
      </View>
    )}
  </View>;
};

const useStyles = createUseStyles((theme) => ({
  view: {
    // backgroundColor: theme.colors.background,
    height: '100%',
    width: '100%',
  },
}))
