export default {
  expo: {
    name: 'FishProvider',
    description: 'Follow Our Leaders, Amplify Your Profits - Everlasting and Stable Success with FishProvider Copy Trading Strategies',
    version: '5.0.0',
    slug: 'fishprovider',
    owner: 'fishprovider',
    scheme: 'fishprovider',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: [
      '**/*',
    ],
    ios: {
      bundleIdentifier: 'com.fishprovider.app',
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      entitlements: {
        'aps-environment': 'development',
        'com.apple.developer.applesignin': ['Default'],
      },
      supportsTablet: true,
    },
    android: {
      package: 'com.fishprovider.app',
      googleServicesFile: './google-services.json',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    plugins: [
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-google-signin/google-signin',
      'expo-apple-authentication',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'ec0f4220-7564-4608-93a3-ac7aebf2c1ab',
      },
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    updates: {
      url: 'https://u.expo.dev/ec0f4220-7564-4608-93a3-ac7aebf2c1ab',
    },
  },
};
