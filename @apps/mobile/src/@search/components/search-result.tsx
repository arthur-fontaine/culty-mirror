import { Image } from "expo-image"
import { Link } from "expo-router"
import { Pressable } from "react-native"
import { UIGroup } from "../../shared/components/group/group"
import { ChevronRightIcon } from "../../shared/components/icons/chevron-right-icon"
import { UIInfo } from "../../shared/components/typos/info"
import { UISmallBody } from "../../shared/components/typos/small-body"
import { UISmallTitle } from "../../shared/components/typos/small-title"
import { createUseStyles } from "../../shared/theme/create-use-styles"
import type { ApiImage } from "../../shared/types/api-image"

interface SearchResultProps {
  id: string
  title: string
  description: string
  isBestResult: boolean
  releaseDate: Date
  categories: string[]
  image: ApiImage
}

export const SearchResult = (props: SearchResultProps) => {
  const { styles } = useStyles()

  return <Link href={`/medias/${props.id}`} asChild push>
    <Pressable>
      <UIGroup horizontal>
        <Image
          placeholder={{ thumbhash: props.image.thumbhash }}
          source={{ uri: props.image.url }}
          style={{
            ...styles.image,
            aspectRatio: props.image.width / props.image.height
          }}
        />
        <UIGroup style={{ flex: 1 }}>
          <UISmallTitle style={styles.title}>{props.title}</UISmallTitle>
          <UIGroup horizontal>
            <UIInfo style={styles.info}>{props.releaseDate.getFullYear()}</UIInfo>
            <UIInfo style={styles.info}>•</UIInfo>
            <UIInfo style={styles.info}>{props.categories.slice(0, 2).join(", ")}</UIInfo>
          </UIGroup>
          <UISmallBody
            numberOfLines={4}
            ellipsizeMode='tail'
            style={styles.description}
          >
            {props.description}
          </UISmallBody>
        </UIGroup>
        <ChevronRightIcon style={styles.icon} />
      </UIGroup>
    </Pressable>
  </Link>
}

const useStyles = createUseStyles((theme) => ({
  searchResultContainerPressed: {
    backgroundColor: theme.colors.backgroundPressed,
  },
  image: {
    width: 75,
    borderRadius: theme.radius.small,
  },
  title: {
    color: theme.colors.primaryText,
  },
  info: {
    color: theme.colors.secondaryText,
  },
  description: {
    color: theme.colors.secondaryText,
  },
  icon: {
    marginVertical: "auto",
    color: theme.colors.secondaryText,
    size: 16,
    padding: theme.paddings.aroundIcon,
  },
}))
