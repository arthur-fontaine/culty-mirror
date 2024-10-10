import { Pressable } from "react-native"
import { UIGroup } from "../../shared/components/group/group"
import { StarIcon } from "../../shared/components/icons/star-icon"
import { createUseStyles } from "../../shared/theme/create-use-styles"
import type { useMedia } from "../hooks/use-media"

interface MediaStarsSelectorProps {
  media: NonNullable<ReturnType<typeof useMedia>['media']>
}

export const MediaStarsSelector = (props: MediaStarsSelectorProps) => {
  const { styles, theme } = useStyles()

  return <UIGroup horizontal style={styles.starsContainer}>
    {new Array(5).fill(null).map((_, index) => {
      const isFilled = props.media.interactions !== undefined
        && props.media.interactions.rating !== "NaN"
        && props.media.interactions.rating !== null
        && props.media.interactions.rating !== undefined
        && props.media.interactions.rating >= index + 1

      return <Pressable
        key={`rate-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          index}`}
        onPress={() => {
          if (props.media.interactions?.rating === index + 1) {
            props.media.rate(undefined)
            return
          }
          props.media.rate(index + 1)
        }}
      >
        <StarIcon
          filled={isFilled}
          style={{
            ...styles.star,
            ...(!isFilled && { color: theme.colors.tertiaryText })
          }}
        />
      </Pressable>
    })}
  </UIGroup>
}

const useStyles = createUseStyles((theme) => ({
  star: {
    color: theme.colors.star,
    size: 16,
    paddingVertical: theme.paddings.aroundIcon,
  },
  starsContainer: {
    justifyContent: 'center',
  },
}))
