import { Text, View } from "react-native"
import { UIGroup } from "../shared/components/group/group"
import { UIIconButton } from "../shared/components/icon-button"
import { BookmarkIcon } from "../shared/components/icons/bookmark-icon"
import { CheckIcon } from "../shared/components/icons/check-icon"
import { HeartIcon } from "../shared/components/icons/heart-icon"
import { UIBody } from "../shared/components/typos/body"
import { DefaultLayout } from "../shared/layouts/default-layout"
import { createUseStyles } from "../shared/theme/create-use-styles"
import { MediaHeader } from "./components/media-header"
import { useMedia } from "./hooks/use-media"

interface MediaPageParams {
  mediaId: string
}

export const MediaPage = (params: MediaPageParams) => {
  const { styles, theme } = useStyles()
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
    <UIGroup>
      <MediaHeader
        {...media}
        image={media.images[0]}
        buttons={[
          !media.interactions?.consumed && <UIIconButton
            key="bookmark"
            icon={BookmarkIcon}
            onPress={media.toggleBookmark}
            filled={media.interactions?.bookmarked ?? false}
          />,
          media.interactions?.consumed && <UIIconButton
            key="favorite"
            icon={HeartIcon}
            onPress={media.toggleFavorite}
            filled={media.interactions?.favorited ?? false}
            style={media.interactions?.favorited && { backgroundColor: theme.colors.like }}
          />,
          <UIIconButton
            key="consume"
            icon={CheckIcon}
            onPress={media.toggleConsume}
            style={media.interactions?.consumed && { backgroundColor: theme.colors.valid }}
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
    </UIGroup>
  </DefaultLayout>
}

const useStyles = createUseStyles((theme) => ({
  description: {
    color: theme.colors.secondaryText,
  },
}))
