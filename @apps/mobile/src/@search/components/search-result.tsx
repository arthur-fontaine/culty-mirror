import { Image } from "expo-image"
import { Link } from "expo-router"
import { View } from "react-native"
import { ChevronRightIcon } from "../../shared/components/icons/chevron-right-icon"
import { Body } from "../../shared/components/typos/body"
import { Info } from "../../shared/components/typos/info"
import { SmallTitle } from "../../shared/components/typos/small-title"
import { createUseStyles } from "../../shared/theme/create-use-styles"

interface SearchResultProps {
  id: string
  title: string
  description: string
  isBestResult: boolean
  releaseDate: Date
  categories: string[]
  image: {
    url: string
    thumbhash: string
    width: number
    height: number
  }
}

export const SearchResult = (props: SearchResultProps) => {
  const { styles } = useStyles()

  return <Link href={`/medias/${props.id}`}>
    <View style={styles.searchResultContainer}>
      <Image
        placeholder={{ thumbhash: props.image.thumbhash }}
        source={{ uri: props.image.url }}
        style={{
          ...styles.image,
          aspectRatio: props.image.width / props.image.height
        }}
      />
      <View style={{ flex: 1 }}>
        <SmallTitle style={styles.title}>{props.title}</SmallTitle>
        <View style={styles.infosContainer}>
          <Info style={styles.info}>{props.releaseDate.getFullYear()}</Info>
          <Info style={styles.info}>•</Info>
          <Info style={styles.info}>{props.categories.slice(0, 2).join(", ")}</Info>
        </View>
        <Body
          style={styles.description}
          numberOfLines={4}
          ellipsizeMode='tail'
        >
          {props.description}
        </Body>
      </View>
      <ChevronRightIcon style={styles.icon} />
    </View>
  </Link>
}

const useStyles = createUseStyles((theme) => ({
  searchResultContainer: {
    flexDirection: "row",
    gap: theme.spacing.horizontal.betweenElements,
  },
  image: {
    width: 75,
    borderRadius: theme.radius.small,
  },
  title: {
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.vertical.groupedElements,
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
    marginTop: theme.spacing.vertical.beforeBody,
  },
  icon: {
    marginVertical: "auto",
    color: theme.colors.secondaryText,
    size: 16,
  },
}))
