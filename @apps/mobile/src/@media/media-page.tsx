import { Button, Text, View } from "react-native"
import { createUseStyles } from "../shared/theme/create-use-styles"
import { useMedia } from "./hooks/use-media"

interface MediaPageParams {
  mediaId: string
}

export const MediaPage = (params: MediaPageParams) => {
  const { styles } = useStyles()
  const { media } = useMedia(params.mediaId)

  return <View style={styles.view}>
    <Text>{media.title}</Text>

    <Button
      title={media.interactions?.favorited ? "Unfavorite" : "Favorite"}
      onPress={media.toggleFavorite}
    />

    <Button
      title={media.interactions?.bookmarked ? "Unbookmark" : "Bookmark"}
      onPress={media.toggleBookmark}
    />

    <Button
      title={media.interactions?.consumed ? "Unconsume" : "Consume"}
      onPress={media.toggleConsume}
    />

    {new Array(5).fill(null).map((_, index) => (
      <Button
        // biome-ignore lint/suspicious/noArrayIndexKey: Index is safe here
        key={`rate-${index}`}
        title={`Rate ${index + 1}`}
        onPress={() => {
          if (media.interactions?.rating === index + 1) {
            media.rate(undefined)
            return
          }
          media.rate(index + 1)
        }}
      />
    ))}
  </View>
}

const useStyles = createUseStyles((theme) => ({
  view: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
}))
