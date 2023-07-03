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