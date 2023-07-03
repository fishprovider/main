# How to initialize?
- Run `npx create-expo-app phone --template tabs`
- Setup `tsconfig.json`
- Run `npx expo install @expo/metro-config`
- Setup `metro.config.js`
- Update scripts in `package.json`
- (Optional) remove tests

# Useful commands
- Check `npx expo-doctor`
- To run in Expo Go
  ```shell
  npm start
  # then Press a or Press i
  ```

- To run in native mode
  ```shell
  npm run native-ios
  npm run native-android
  ```

# Setup `expo-router`
- Run `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-native-gesture-handler`
- Add `overrides` to `package.json`
  ```json
  "overrides": {
    "metro": "0.76.0",
    "metro-resolver": "0.76.0"
  }
  ```
- Add babel plugins
  ```js
  plugins: [
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
    require.resolve('expo-router/babel'),
  ]
  ```