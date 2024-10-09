import { Image } from "expo-image"
import { Link } from "expo-router"
import { useCallback, useState } from "react"
import { Pressable, View } from "react-native"
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

  const [isPressed, setIsPressed] = useState(false)
  const handlePressIn = useCallback(() => setIsPressed(true), [])
  const handlePressOut = useCallback(() => setIsPressed(false), [])

  return <Link href={`/medias/${props.id}`} asChild push>
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        ...styles.searchResultContainer,
        ...(isPressed && styles.searchResultContainerPressed),
      }}
    >
      <Image
        placeholder={{ thumbhash: props.image.thumbhash }}
        source={{ uri: props.image.url }}
        style={{
          ...styles.image,
          aspectRatio: props.image.width / props.image.height
        }}
      />
      <View style={{ flex: 1 }}>
        <UISmallTitle style={styles.title}>{props.title}</UISmallTitle>
        <View style={styles.infosContainer}>
          <UIInfo style={styles.info}>{props.releaseDate.getFullYear()}</UIInfo>
          <UIInfo style={styles.info}>•</UIInfo>
          <UIInfo style={styles.info}>{props.categories.slice(0, 2).join(", ")}</UIInfo>
        </View>
        <UISmallBody
          style={styles.description}
          numberOfLines={4}
          ellipsizeMode='tail'
        >
          {props.description}
        </UISmallBody>
      </View>
      <ChevronRightIcon style={styles.icon} />
    </Pressable>
  </Link>
}

const useStyles = createUseStyles((theme) => ({
  searchResultContainer: {
    flexDirection: "row",
    gap: theme.spacing.horizontal.insideGroup,
    marginHorizontal: -theme.spacing.horizontal.screen,
    paddingHorizontal: theme.spacing.horizontal.screen,
    paddingVertical: theme.spacing.vertical.insideGroup / 2,
  },
  searchResultContainerPressed: {
    backgroundColor: theme.colors.backgroundPressed,
  },
  image: {
    width: 75,
    borderRadius: theme.radius.small,
  },
  title: {
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.vertical.glued,
  },
  info: {
    color: theme.colors.secondaryText,
  },
  infosContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  description: {
    color: theme.colors.secondaryText,
    marginTop: theme.spacing.vertical.beforeTextBody,
  },
  icon: {
    marginVertical: "auto",
    color: theme.colors.secondaryText,
    size: 16,
  },
}))
