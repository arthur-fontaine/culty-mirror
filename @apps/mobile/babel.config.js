module.exports = (api) => {
  api.cache(true);
  return {
    plugins: [
      [require('babel-plugin-agrume').agrumePlugin, {}]
    ],
    presets: ['babel-preset-expo'],
  };
};
