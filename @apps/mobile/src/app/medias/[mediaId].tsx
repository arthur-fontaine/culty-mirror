import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { MediaPage } from "../../@media/media-page";

export default () => {
  const local = useLocalSearchParams();

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const mediaId = local["mediaId"];

  if (mediaId === undefined || typeof mediaId !== "string") {
    // TODO: Redirect to 404
    return <Text>Media ID not found</Text>;
  }

  return <MediaPage mediaId={mediaId} />;
};
