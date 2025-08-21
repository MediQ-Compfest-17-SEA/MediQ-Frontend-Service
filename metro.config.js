const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("jotai")) {
    return context.resolveRequest(
      { ...context, unstable_conditionNames: ["react-native", "module", "default"] },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};


module.exports = withNativeWind(config, { input: './styles/global.css' })