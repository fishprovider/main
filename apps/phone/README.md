# How to initialize?
- Run `npx create-expo-app phone --template tabs`
- Setup `tsconfig.json`
- Run `npx expo install @expo/metro-config`
- Setup `metro.config.js`
- Update scripts in `package.json`
- (Optional) remove tests

# Useful commands
- To run in Expo Go
  ```shell
  npm start
  # Press i to start ios simulator
  # Press a to start android simulator
  ```

- To run in native mode
  ```shell
  npm run native-ios
  npm run native-android
  ```

- To update packages
  ```shell
  ncu -u
  npx expo-doctor
  npx expo install --check
  ```

# Setup `expo-router`
- Run `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-native-gesture-handler react-native-reanimated`
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