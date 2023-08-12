module.exports = {
  color: true,
  format: ["group", "ownerChanged", "repo"],
  reject: [
    'eslint-config-next',
    // packages/core
    'googleapis',
    // packages/ctrader
    'protobufjs',
    // packages/metatrader
    'metaapi.cloud-sdk',
    // apps/back
    'glob',
    // apps/phone
    "@react-native-async-storage/async-storage",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-google-signin/google-signin",
    "@react-navigation/bottom-tabs",
    "@react-navigation/drawer",
    "@react-navigation/native",
    "@react-navigation/stack",
    "babel-plugin-transform-inline-environment-variables",
    "burnt",
    "expo",
    "expo-apple-authentication",
    "expo-build-properties",
    "expo-dev-client",
    "expo-device",
    "expo-font",
    "expo-notifications",
    "expo-status-bar",
    "expo-system-ui",
    "expo-updates",
    "expo-web-browser",
    "react-native",
    "react-native-gesture-handler",
    "react-native-logs",
    "react-native-reanimated",
    "react-native-safe-area-context",
    "react-native-screens",
    "react-native-web",
  ],
};
