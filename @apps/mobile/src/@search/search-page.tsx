import { Text, View } from "react-native";
import { Spacer, UIGroup } from "../shared/components/group/group";
import { SearchIcon } from "../shared/components/icons/search-icon";
import { UITextInput } from "../shared/components/text-input";
import { DefaultLayout } from "../shared/layouts/default-layout";
import { groupByN } from "../shared/utils/group-by-n";
import { SearchResult } from "./components/search-result";
import { useSearch } from "./hooks/use-search";

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
        <UIGroup vertical>
          {groupByN(2, data.results).map((post, i) => (
            <View key={post[0]?.resultId} style={{ flexDirection: 'row' }}>
              {post[0] && <SearchResult
                id={post[0].resultId}
                isBestResult={i === 0}
                {...post[0]}
              />}
              <Spacer horizontal />
              {post[1] ? <SearchResult
                id={post[1].resultId}
                isBestResult={i === 0}
                {...post[1]}
              /> : <View style={{ flex: 1 }} />}
            </View>
          ))}
        </UIGroup>
      )}
    </UIGroup>
  </DefaultLayout>;
};
