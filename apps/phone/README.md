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

- Rename `index.ts` to `index.js` (otherwise eas build will fail)

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
    const { getDefaultConfig } = require('@expo/metro-config');
    const defaultConfig = getDefaultConfig(__dirname);
    module.exports = {
      ...defaultConfig,
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
    "preinstall": "cd ../.. && npm install -w packages/utils -w packages/cross && npm run build -w packages/utils -w packages/cross",
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
- Copy fonts from `node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts` to `assets/fonts`

- Load the fonts
  ```js
  const [loaded, error] = useFonts({
    FontAwesome: require('../assets/fonts/FontAwesome.ttf'),
  });
  ```


# How to deploy?
- Update `app.json` for these fields `name`, `slug`, `owner`, `scheme`, `ios.bundleIdentifier`, `android.package`
  ```json
  {
    "expo": {
      "name": "FishProvider",
      "description": "Never Lose Money - Think Big Do Small",
      "version": "5.0.0",
      "slug": "fishprovider",
      "owner": "fishprovider",
      "scheme": "fishprovider",
      "orientation": "portrait",
      "icon": "./assets/images/icon.png",
      "userInterfaceStyle": "automatic",
      "splash": {
        "image": "./assets/images/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "assetBundlePatterns": [
        "**/*"
      ],
      "ios": {
        "bundleIdentifier": "com.fishprovider.app",
        "supportsTablet": true
      },
      "android": {
        "package": "com.fishprovider.app",
        "adaptiveIcon": {
          "foregroundImage": "./assets/images/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        }
      }
    }
  }
  ```

- Create a project in https://expo.dev, e.g. https://expo.dev/accounts/fishprovider/projects/fishprovider
  ```shell
  npm i -g eas-cli
  eas login
  eas init --id ec0f4220-7564-4608-93a3-ac7aebf2c1ab # ProjectId from expo.dev
  eas build:configure
  ```

- Update `eas.json` by adding `development-simulator` profile
  ```json
  {
    "cli": {
      "version": ">= 3.15.0"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "development-simulator": {
        "extends": "development",
        "ios": {
          "simulator": true
        }
      },
      "preview": {
        "distribution": "internal"
      },
      "production": {}
    },
    "submit": {
      "production": {}
    }
  }
  ```

- Create a build for simulator
  ```shell
  eas build --profile development-simulator --platform ios
  eas build --profile development --platform android
  ```

  Then download the build, extract, and drag to simulator to install the app

  Then run `npm run dev`

- Create a build for device

  TODO:


# How to setup UI components?
TODO: use Tamagui
