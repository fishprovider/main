import type { User } from '@fishbot/utils/types/User.model';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// import { LoginMethods } from '~constants/user';

const logout = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error('Failed to logout', error);
  }
};

const loginOAuth = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
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

function refreshUserToken() {
  const user = auth().currentUser;
  if (!user) return undefined;
  return getUserToken(user, true);
}

const getUserAuthInfo = (
  userAuth: FirebaseAuthTypes.User,
  field: keyof FirebaseAuthTypes.UserInfo,
) => (userAuth as FirebaseAuthTypes.UserInfo)[field]
  || userAuth.providerData.find((item) => item[field])?.[field]
  || '';

function authOnChange(
  onClientLoggedIn: (user: User, token: string) => void,
  onClientLoggedOut: () => void,
) {
  const unsub = auth().onAuthStateChanged(async (user) => {
    // user is null (not undefined)
    if (!user) {
      onClientLoggedOut();
      return;
    }

    const token = await getUserToken(user);
    if (!token) {
      onClientLoggedOut();
      return;
    }

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
    onClientLoggedIn(userInfo, token);
  });

  return unsub;
}

export {
  authOnChange,
  loginOAuth,
  loginWithPassword,
  logout,
  refreshUserToken,
};
