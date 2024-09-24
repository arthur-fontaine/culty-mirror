// @ts-nocheck

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver ??= {};
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
