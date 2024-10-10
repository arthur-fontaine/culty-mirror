import { Text, View } from "react-native"
import { AutoSpacer"../shared/components/grgrgrgrgroup/spacer
import { UIIconButton } from "../shared/components/iconbutton
import { BookmarkIconconconconcon } from "../shared/compobookmarkokmarkokmarkokmarkokmark-icon"
import { CheckIconrom "../shared/components/iiiiiconsccheck-iconconconconcon"
import { UIBody } from "../shared/components/typos/body"
import { DefaultLayout } from "../shared/layouts/default-layout"
import { createUseStyles } from "../shared/theme/create-use-styles"
import { MediaHeader } from "./components/media-header"
import { useMedia } from "./hooks/use-media"

interface MediaPageParams {
  mediaId: string
}

export const MediaPage = (params: MediaPageParams) => {
  const { styles } = useStyles()
  const { media, isLoading } = useMedia(params.mediaId)

  if (isLoading) {
    return <View>
      <Text>Loading...</Text>
    </View>
  }

  if (!media) {
    return <View>
      <Text>Media not found</Text>
    </View>
  }

  return <DefaultLayout>
    <AutoSpacer>
      <MediaHeader
        {...media}
        image={media.images[0]}
        buttons={[
          <UIIconButton
            key="favorite"
            icon={BookmarkIcon}
            onPress={media.toggleBookmark}
          />,
          <UIIconButton
            key="consume"
            icon={CheckIcon}
            onPress={media.toggleConsume}
          />
        ]}
      />
      <UIBody style={styles.description}>{media.description}</UIBody>

      {/* <Button
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
      ))} */}
    </AutoSpacer>
  </DefaultLayout>
}

const useStyles = createUseStyles((theme) => ({
  description: {
    color: theme.colors.secondaryText,
    // marginTop: theme.spacing.vertical.betweenDifferentElements,
  },
}))
