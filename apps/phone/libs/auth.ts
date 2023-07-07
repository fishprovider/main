import type { User } from '@fishbot/utils/types/User.model';
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

// actions

const initFirebase = () => {
  GoogleSignin.configure();
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

    const token = await getUserToken(user);
    if (!token) {
      onClientLoggedOut();
      return;
    }
    const userInfo = parseUser(user);
    onClientLoggedIn(userInfo, token);
  } catch (err) {
    console.error('Failed to login', err);
  }
};

const loginWithPassword = (email: string, password: string, isLogin: boolean) => {
  if (isLogin) {
    auth().createUserWithEmailAndPassword(email, password).catch((err) => {
      console.error('Failed to login', err);
    });
  } else {
    auth().createUserWithEmailAndPassword(email, password).catch((err) => {
      console.error('Failed to signup', err);
    });
  }
};

function authOnChange(
  onLoggedIn: (user: User, token: string) => void,
  onLoggedOut: () => void,
) {
  const unsub = auth().onAuthStateChanged(async (user) => {
    // user is null (not undefined)
    if (!user) {
      onLoggedOut();
      return;
    }

    const token = await getUserToken(user);
    if (!token) {
      onLoggedOut();
      return;
    }

    const userInfo = parseUser(user);
    onLoggedIn(userInfo, token);
  });

  return unsub;
}

export {
  authOnChange,
  initFirebase,
  loginOAuth,
  loginWithPassword,
  logout,
  refreshUserToken,
};
