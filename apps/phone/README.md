# How to dev?
- To run in Expo Go
  ```shell
  npm start # or npm start -- --clear
  # Press i to start ios simulator
  # Press a to start android simulator
  ```
  Note that, this run mode supports only Expo libraries, React Native libraries will not work. To support React Native libraries, use the run mode with Development build as below

- To run with Development builds
  ```shell
  # Build the app
  eas build --profile development-simulator --platform all

  # Download the build and drag to the simulator to install the app
  # Note that
  # - need to rebuild for any native code changes
  # - no need to rebuild for any JS code changes

  # Run dev client
  npm run dev # or npm run dev -- --clear
  ```

- To update packages
  ```shell
  ncu -u
  npm run doctor
  ```

# How to initialize?
- Run `npx create-expo-app@latest phone --template typescript`

- Create `index.js` and remove `main` in `package.json`
  ```js
  import registerRootComponent from 'expo/build/launch/registerRootComponent';
  import App from './App';
  registerRootComponent(App);
  ```

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
          "~*": ["./*"]
        },
        "rootDir": ".",
        "outDir": "dist"
      },
      "include": ["**/*.ts", "**/*.tsx", "index.js", "*.config.js"],
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
              // Note that '~': '.' does not work
              '~constants': './constants',
              '~utils': './utils',
              '~libs': './libs',
              '~hooks': './hooks',
              '~ui': './ui',
              '~components': './components',
              '~controllers': './controllers',
              '~layouts': './layouts',
              '~views': './views',
            },
          }],
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
    "doctor": "npx expo-doctor",
    "lint": "eslint --cache --fix .",
    "type-check": "tsc --noEmit",
    "eas-build-post-install": "./build-packages.sh",
    "start": "NODE_ENV=development doppler run --print-config -- expo start",
    "dev": "NODE_ENV=development expo start --dev-client",
    "native-android": "expo run:android",
    "native-ios": "expo run:ios"
  }
  ```

- (Optional) remove tests

# How to setup assets?
- Copy fonts from `node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts` to `assets/fonts`

- Load the fonts
  ```js
  const [loaded, error] = useFonts({
    FontAwesome: require('../assets/fonts/FontAwesome.ttf'),
  });
  ```


# How to build?
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
        "googleServicesFile": "./GoogleService-Info.plist",
        "supportsTablet": true
      },
      "android": {
        "package": "com.fishprovider.app",
        "googleServicesFile": "./google-services.json",
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
      "appVersionSource": "remote"
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
  eas build --profile development-simulator --platform all
  ```

  Then download the build, extract, and drag to simulator to install the app
  Then run `npm run dev`

# How to deploy?

- Update `app.json`
  ```shell
  "ios": {
    "googleServicesFile": "./GoogleService-Info.plist",
  },
  "android": {
    "googleServicesFile": "./google-services.json",
  }
  ```

- Create those files above in Firebase console

- Build and submit
  ```shell
  eas build --profile production -p all --auto-submit
  ```

- (Android only) Play Store requires a manual upload on the first deploy

# Install RN Firebase

- Update `app.json`
  ```json
  "plugins": [
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-google-signin/google-signin",
    [
      "expo-build-properties",
      {
        "ios": {
          "useFrameworks": "static"
        }
      }
    ]
  ]
  ```
