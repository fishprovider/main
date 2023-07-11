import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

import { LoginMethods } from '~constants/user';
import { onClientLoggedIn, onClientLoggedOut } from '~utils/user';

const getUserAuthInfo = (
  userAuth: FirebaseAuthTypes.User,
  field: keyof FirebaseAuthTypes.UserInfo,
) => (userAuth as FirebaseAuthTypes.UserInfo)[field]
  || userAuth.providerData.find((item) => item[field])?.[field]
  || '';

const parseUser = (user: FirebaseAuthTypes.User) => {
  const { uid } = user;
  const email = getUserAuthInfo(user, 'email');
  const name = getUserAuthInfo(user, 'displayName') || email.split('@')[0] || email;
  const picture = getUserAuthInfo(user, 'photoURL');

  const userInfo = {
    _id: uid,
    uid,
    email,
    name,
    picture,
  };
  return userInfo;
};

const getUserToken = async (user: FirebaseAuthTypes.User, forceRefresh?: boolean) => {
  try {
    const isRefresh = forceRefresh;
    const token = await user.getIdToken(isRefresh);
    return token;
  } catch (err) {
    console.error('Failed to fetch token', err);
    return undefined;
  }
};

const onLoggedIn = async (user: FirebaseAuthTypes.User) => {
  const token = await getUserToken(user, true);
  if (!token) {
    onClientLoggedOut();
    return;
  }
  const userInfo = parseUser(user);
  onClientLoggedIn(userInfo, token);
};

// actions

const initAuth = () => {
  GoogleSignin.configure({
    webClientId: '130013915084-2qtkr5q2f6pfjp68cb5tmc3qke1p2m24.apps.googleusercontent.com',
  });
};

const logout = async () => {
  try {
    await auth().signOut();
    await GoogleSignin.signOut();
    await onClientLoggedOut();
  } catch (error) {
    console.error('Failed to logout', error);
  }
};

function refreshUserToken() {
  const user = auth().currentUser;
  if (!user) return undefined;
  return getUserToken(user, true);
}

const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const credentials = auth.GoogleAuthProvider.credential(userInfo.idToken);
    return { userInfo, credentials };
  } catch (err: any) {
    console.error('Failed to loginWithGoogle', err);
    throw err;
  }
};

const loginWithApple = async () => {
  try {
    const userInfo = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const credentials = auth.AppleAuthProvider.credential(userInfo.identityToken);
    return { userInfo, credentials };
  } catch (err: any) {
    console.error('Failed to loginWithApple', err);
    throw err;
  }
};

const loginOAuth = async (loginMethod: LoginMethods) => {
  try {
    const getCredentials = () => {
      switch (loginMethod) {
        case LoginMethods.apple: return loginWithApple();
        case LoginMethods.google: return loginWithGoogle();
        default: throw new Error(`Unhandled login method ${loginMethod}`);
      }
    };
    const { credentials } = await getCredentials();

    const { user } = await auth().signInWithCredential(credentials);
    await onLoggedIn(user);
  } catch (err) {
    console.error('Failed to login', err);
  }
};

const loginWithPassword = async (email: string, password: string, isLogin: boolean) => {
  try {
    if (isLogin) {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      await onLoggedIn(user);
    } else {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      await onLoggedIn(user);
    }
  } catch (err) {
    console.error('Failed to login', err);
  }
};

function authOnChange() {
  return auth().onAuthStateChanged(async (user) => {
    // user is null (not undefined)
    if (!user) {
      onClientLoggedOut();
      return;
    }
    await onLoggedIn(user);
  });
}

export {
  authOnChange,
  initAuth,
  loginOAuth,
  loginWithPassword,
  logout,
  refreshUserToken,
};
