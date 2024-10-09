import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { View } from "react-native"
import { UIInfo } from "../../shared/components/typos/info"
import { UITitle } from "../../shared/components/typos/title"
import { createUseStyles } from "../../shared/theme/create-use-styles"
import type { ApiImage } from "../../shared/types/api-image"

interface PosterHeaderProps {
  image: ApiImage | undefined
  title: string
  durationInMinutes: number
  releaseDate: Date
  categories: string[]

  buttons?: React.ReactNode[]
}

export const PosterHeader = (props: PosterHeaderProps) => {
  const { styles } = useStyles()

  return <View style={styles.posterHeader}>
    {props.image && <Image
      placeholder={{ thumbhash: props.image.thumbhash }}
      source={{ uri: props.image.url }}
      style={{
        width: "100%",
        aspectRatio: props.image.width / props.image.height,
      }}
    />}
    <DefaultInfos {...props} />
  </View>
}

const DefaultInfos = (props: PosterHeaderProps) => {
  const { styles } = useStyles()

  return <View style={styles.infosWithButtonsContainer}>
    <View style={styles.headerRowContainer}>
      <View style={styles.infosContainer}>
        <UITitle style={styles.info}>{props.title}</UITitle>
        <View style={styles.detailedInfosContainer}>
          <UIInfo style={styles.detailedInfo}>{Math.floor(props.durationInMinutes / 60)}h{(props.durationInMinutes % 60).toString().padStart(2, "0")}</UIInfo>
          <UIInfo style={styles.detailedInfo}>{props.releaseDate.getFullYear()}</UIInfo>
          <UIInfo style={styles.detailedInfo}>{props.categories.slice(0, 2).join(", ")}</UIInfo>
        </View>
      </View>
      {props.buttons && props.buttons.length > 0 && <View style={styles.buttonsContainer}>
        {props.buttons}
      </View>}
    </View>
    <LinearGradient
      colors={[styles.infosBackground.color1, styles.infosBackground.color2, styles.infosBackground.color3, styles.infosBackground.color4]}
      style={styles.infosBackground}
    />
  </View>
}

const useStyles = createUseStyles(theme => ({
  posterHeader: {
    marginHorizontal: -theme.spacing.horizontal.screen,
    marginTop: -theme.spacing.vertical.screen,
    position: "relative",
  },
  infosWithButtonsContainer: {
    flexDirection: "row",
    padding: theme.paddings.large,
    paddingBottom: 0,
    position: "absolute",
    bottom: 0,
    width: "100%",
    minHeight: 'auto',
    height: '33%',
    alignItems: "flex-end",
  },
  infosBackground: {
    color1: `${theme.colors.background}00`,
    color2: `${theme.colors.background}B3`,
    color3: `${theme.colors.background}F2`,
    color4: `${theme.colors.background}FF`,
    position: "absolute",
    zIndex: -1,
    height: "100%",
    width: "100%",
    margin: -theme.paddings.large,
    marginBottom: 0,
  },
  headerRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infosContainer: {
    flex: 1,
  },
  info: {
    color: theme.colors.primaryText,
  },
  detailedInfosContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.horizontal.insideGroup,
    marginTop: theme.spacing.vertical.glued,
  },
  detailedInfo: {
    color: theme.colors.secondaryText,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: theme.spacing.horizontal.glued,
    marginLeft: theme.spacing.horizontal.insideGroup,
  },
}))

