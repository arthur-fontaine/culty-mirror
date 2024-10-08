import { Link } from "expo-router";
import { Text, View } from "react-native";
import { UITextInput } from "../shared/components/text-input";
import { DefaultLayout } from "../shared/layouts/default-layout";
import { createUseStyles } from "../shared/theme/create-use-styles";
import { useSearch } from "./hooks/use-search";
import { SearchIcon } from "../shared/components/icons/search-icon";

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
        {data.results.map((post) => (
          <Link key={post.resultId} href={`/medias/${post.resultId}`}>
            <Text>{post.title}</Text>
          </Link>
        ))}
      </View>
    )}
  </DefaultLayout>;
};

const useStyles = createUseStyles((theme) => ({
}))
