// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNative = require("eslint-plugin-react-native");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-native": reactNative,
    },
    rules: {
      "react-native/no-raw-text": ["error",
        {
          skip: ["FormLabel", "FormField", "FormMessage"],
        }
      ], 
      
    },
  },
]);
