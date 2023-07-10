import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { onClientLoggedIn, onClientLoggedOut } from '~utils/user';

// import { LoginMethods } from '~constants/user';

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

const loginOAuth = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const { user } = await auth().signInWithCredential(googleCredential);
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
