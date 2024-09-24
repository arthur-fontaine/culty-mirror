import type { ExpoConfig, ConfigContext } from 'expo/config';

export default (_: ConfigContext): ExpoConfig => ({
  name: "culty",
  slug: "culty",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./dist/assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./dist/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./dist/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./dist/assets/images/favicon.png",
  },
  plugins: [["expo-router", { root: "./dist/app" }]],
  experiments: {
    typedRoutes: true,
  },
});
