# How to dev?
- To run in Expo Go
  ```shell
  npm start # or npm run start-clean
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
  npm run doctor
  ```

# How to initialize?
- Run `npx create-expo-app phone --template tabs`

- Setup path aliases by updating `tsconfig.json`, `babel.config.js`, `metro.config.js` as belows

  + Update `tsconfig.json`
    ```json
    {
      "extends": "@tsconfig/react-native/tsconfig.json",
      "compilerOptions": {
        "composite": true,
        "exactOptionalPropertyTypes": false,
        "noPropertyAccessFromIndexSignature": false,
        "baseUrl": ".",
        "paths": {
          "@fishbot/utils*": ["../../packages/utils/dist*"],
          "@fishbot/cross*": ["../../packages/cross/dist*"],
          "~*": ["./*"]
        },
        "rootDir": ".",
        "outDir": "dist"
      },
      "include": ["**/*.ts", "**/*.tsx"],
      "exclude": ["node_modules"],
      "references": [
        { "path": "../../packages/utils" },
        { "path": "../../packages/cross" }
      ]
    }
    ```

  + Update `babel.config.js`
    ```js
    module.exports = function (api) {
      api.cache(true);
      return {
        presets: ['babel-preset-expo'],
        plugins: [
          ['module-resolver', {
            root: '.',
            alias: {
              '@fishbot/utils': '../../packages/utils/dist',
              '@fishbot/cross': '../../packages/cross/dist',
              // Note that '~': '.' does not work
              '~constants': './constants',
              '~components': './components',
            },
          }],
          require.resolve('expo-router/babel'),
        ],
      };
    };
    ```

  + Update `metro.config.js`
    ```js
    module.exports = {
      watchFolders: [
        '../../node_modules',
        '../../packages/utils',
        '../../packages/cross',
      ],
    };
    ```

- Update scripts in `package.json`
  ```json
  "scripts": {
    "doctor": "npx expo-doctor && expo install --check",
    "preinstall": "cd ../.. && npm install -w packages/utils -w packages/cross",
    "lint": "eslint --cache --fix --ignore-pattern babel.config.js --ignore-pattern metro.config.js .",
    "type-check": "tsc --noEmit",
    "start": "doppler run --print-config -- expo start",
    "start-clean": "npm run start -- --clear",
    "native-android": "expo run:android",
    "native-ios": "expo run:ios"
  }
  ```

- (Optional) remove tests

# How to setup app icons?
TODO

# How to deploy?
TODO: use EAS

# How to setup UI components?
TODO: use Tamagui
