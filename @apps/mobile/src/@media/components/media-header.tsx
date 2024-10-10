import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { View } from "react-native"
import { UIGroup } from "../../shared/components/group/group"
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

export const MediaHeader = (props: PosterHeaderProps) => {
  const { styles } = useStyles()

  return <View style={styles.root}>
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
  const { styles, theme } = useStyles()

  return <View style={styles.posterInfosWrapper}>
    <View style={styles.infosBgUnifier}>
      <LinearGradient
        colors={[`${theme.colors.background}00`, `${theme.colors.background}B3`, `${theme.colors.background}F2`, theme.colors.background]}
        style={styles.infosGradientBg}
      />
      <View style={styles.header}>

        <UIGroup>
          <UITitle style={styles.title}>{props.title}</UITitle>
          <UIGroup horizontal>
            <UIInfo style={styles.info}>{Math.floor(props.durationInMinutes / 60)}h{(props.durationInMinutes % 60).toString().padStart(2, "0")}</UIInfo>
            <UIInfo style={styles.info}>{props.releaseDate.getFullYear()}</UIInfo>
            <UIInfo style={styles.info}>{props.categories.slice(0, 2).join(", ")}</UIInfo>
          </UIGroup>
        </UIGroup>

        <UIGroup horizontal>
          {props.buttons}
        </UIGroup>

      </View>
    </View>
  </View>
}

const useStyles = createUseStyles(theme => ({
  root: {
    marginHorizontal: -theme.paddings.horizontalScreen,
    marginTop: -theme.paddings.verticalScreen,
    position: "relative",
  },
  posterInfosWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "33%",
  },
  infosBgUnifier: {
    position: "relative",
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  infosGradientBg: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.paddings.horizontalScreen,
    paddingBottom: 0,
  },
  title: {
    color: theme.colors.primaryText,
  },
  info: {
    color: theme.colors.secondaryText,
  },
}))

