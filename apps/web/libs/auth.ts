import type { User } from '@fishbot/utils/types/User.model';
import type { FirebaseError } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  linkWithCredential,
  OAuthCredential,
  OAuthProvider,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  TwitterAuthProvider,
  updatePassword,
  updateProfile,
  User as UserAuth,
  UserInfo,
} from 'firebase/auth';
import moment from 'moment';

import { LoginMethods } from '~constants/user';
import { cacheRead, cacheWrite } from '~libs/cache';
import { toastError, toastInfo, toastWarn } from '~ui/toast';
import { cacheKeyUser, onClientLoggedIn, onClientLoggedOut } from '~utils/user';

const env = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MEASUREMENT_ID,
};

const initFirebase = () => {
  const config = {
    apiKey: env.apiKey,
    authDomain: `${env.projectId}.firebaseapp.com`,
    databaseURL: `https://${env.projectId}.firebaseio.com`,
    projectId: env.projectId,
    storageBucket: `${env.projectId}.appspot.com`,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId,
    measurementId: env.measurementId,
  };

  initializeApp(config);

  // TODO: add server: analytics, perf monitor
  // https://firebase.google.com/docs/web/setup#available-services
};

const getUserAuthInfo = (
  userAuth: UserAuth,
  field: keyof UserInfo,
) => userAuth[field]
  || userAuth.providerData.find((item) => item[field])?.[field]
  || '';

const parseUser = (user: UserAuth) => {
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

interface UserToken {
  token: string,
  createdAt: Date
}
const cacheKeyUserToken = 'fp-userToken';

const cacheWriteUserToken = (userToken?: UserToken) => cacheWrite(cacheKeyUserToken, userToken);

const cacheReadUserToken = () => cacheRead<UserToken>(cacheKeyUserToken);

const getUserToken = async (user: UserAuth, forceRefresh?: boolean) => {
  try {
    const cacheToken = await cacheReadUserToken();
    const isRefresh = forceRefresh
      || !cacheToken?.createdAt
      || moment().diff(cacheToken.createdAt, 'minutes') > 30;

    const token = await user.getIdToken(isRefresh);
    cacheWriteUserToken({
      token,
      createdAt: isRefresh ? new Date() : cacheToken.createdAt,
    });
    return token;
  } catch (error) {
    Logger.error('Failed to fetch token', error);
    toastError(`Failed to fetch token ${error}`);
    return undefined;
  }
};

const onLoggedIn = async (
  user: UserAuth,
  redirect: (redirectUrl: string) => void,
) => {
  const token = await getUserToken(user);
  if (!token) {
    onClientLoggedOut();
    return;
  }
  const userInfo = parseUser(user);
  onClientLoggedIn(userInfo, token, redirect);
};

//
// actions
//

const logout = async () => {
  cacheWriteUserToken();
  await getAuth().signOut().then(() => {
    toastInfo('Logged out successfully');
    window.location.reload();
  });
};

const refreshUserToken = async () => {
  const user = getAuth()?.currentUser;
  if (!user) return undefined;
  return getUserToken(user, true);
};

const getAuthMethod = (method: LoginMethods) => {
  let authMethod;
  let credentialFromError;
  switch (method) {
    case LoginMethods.google: {
      authMethod = new GoogleAuthProvider();
      credentialFromError = GoogleAuthProvider.credentialFromError;
      break;
    }
    case LoginMethods.facebook: {
      authMethod = new FacebookAuthProvider();
      credentialFromError = FacebookAuthProvider.credentialFromError;
      break;
    }
    case LoginMethods.twitter: {
      authMethod = new TwitterAuthProvider();
      credentialFromError = TwitterAuthProvider.credentialFromError;
      break;
    }
    case LoginMethods.microsoft: {
      authMethod = new OAuthProvider('microsoft.com');
      credentialFromError = OAuthProvider.credentialFromError;
      authMethod.setCustomParameters({
        prompt: 'select_account',
      });
      break;
    }
    case LoginMethods.yahoo: {
      authMethod = new OAuthProvider('yahoo.com');
      credentialFromError = OAuthProvider.credentialFromError;
      authMethod.setCustomParameters({
        prompt: 'login',
      });
      break;
    }
    case LoginMethods.github: {
      authMethod = new GithubAuthProvider();
      credentialFromError = GithubAuthProvider.credentialFromError;
      break;
    }
    case LoginMethods.apple: {
      authMethod = new OAuthProvider('apple.com');
      credentialFromError = OAuthProvider.credentialFromError;
      break;
    }
    default: {
      toastWarn(`Unknown method: ${method}`);
      break;
    }
  }
  return { authMethod, credentialFromError };
};

const errorHandler = (
  error: any,
  auth: Auth,
  credentialFromError: (error: FirebaseError) => OAuthCredential | null,
) => {
  Logger.info(error.customData);

  if (error.code === 'auth/account-exists-with-different-credential') {
    toastWarn('Email already exists with different credential. Linking now...');

    const pendingCred = credentialFromError(error);
    if (!pendingCred) {
      toastError('Failed to link account, missing pendingCred');
      return;
    }

    const { email } = error.customData;

    fetchSignInMethodsForEmail(auth, email)
      .then((methods) => {
        const method = methods[0];
        toastInfo(`Email already exists with "${method}". Linking now...`);
        if (method === 'password') {
          // eslint-disable-next-line no-alert
          const password = prompt('Enter your account password') || '';
          signInWithEmailAndPassword(auth, email, password).then((result) => {
            linkWithCredential(result.user, pendingCred);
          });
          return;
        }

        const { authMethod } = getAuthMethod(method as LoginMethods);
        if (!authMethod) {
          toastError(`Failed to link account with method: ${method}`);
          return;
        }

        toastInfo(`Logging in with "${method}" now...`);
        signInWithPopup(auth, authMethod).then((result) => {
          linkWithCredential(result.user, pendingCred);
        });
      })
      .catch((errorLink) => {
        Logger.error(errorLink);
        toastError(`Failed to link account: ${errorLink}`);
      });
  } else {
    toastError(`Failed to login: ${error.message}`);
  }
};

const loginFromCache = async (
  redirect: (redirectUrl: string) => void,
) => {
  try {
    const cacheUserToken = await cacheReadUserToken();
    Logger.debug('[user] cacheUserToken', cacheUserToken);
    if (!cacheUserToken?.createdAt
    || moment().diff(cacheUserToken.createdAt, 'minutes') > 60
    ) return;

    const cacheUser = await cacheRead<User>(cacheKeyUser);
    Logger.debug('[user] cacheUser', cacheUser);
    if (!cacheUser) return;

    await onClientLoggedIn(cacheUser, cacheUserToken.token, redirect);
  } catch (err) {
    console.error('Failed to login', err);
  }
};

const loginOAuth = async (
  method: LoginMethods,
  redirect: (redirectUrl: string) => void,
) => {
  const { authMethod, credentialFromError } = getAuthMethod(method);
  if (authMethod && credentialFromError) {
    const auth = getAuth();
    try {
      const { user } = await signInWithPopup(auth, authMethod);
      await onLoggedIn(user, redirect);
    } catch (err) {
      console.error('Failed to login', err);
      errorHandler(err, auth, credentialFromError);
    }
  }
};

const loginWithPassword = async (
  email: string,
  password: string,
  isLogin: boolean,
  redirect: (redirectUrl: string) => void,
) => {
  try {
    const auth = getAuth();
    if (isLogin) {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await onLoggedIn(user, redirect);
    } else {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await onLoggedIn(user, redirect);
    }
  } catch (err) {
    console.error('Failed to login', err);
  }
};

const sendMagicLink = (email: string) => {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  sendSignInLinkToEmail(getAuth(), email, actionCodeSettings)
    .then(() => {
      toastInfo({
        message: 'Email sent! Please check mailbox to login with the magic link',
        autoClose: false,
      });
    })
    .catch((error) => {
      Logger.error('Failed to send magic link', error);
      toastError(`Failed to send magic link ${error}`);
    });
};

const isSignInWithMagicLink = () => isSignInWithEmailLink(getAuth(), window.location.href);

const loginWithMagicLink = async (
  email: string,
  redirect: (redirectUrl: string) => void,
) => {
  try {
    const { user } = await signInWithEmailLink(getAuth(), email, window.location.href);
    await onLoggedIn(user, redirect);
  } catch (err) {
    console.error('Failed to login', err);
  }
};

const authOnChange = (
  redirect: (redirectUrl: string) => void,
) => getAuth().onAuthStateChanged(async (user) => {
  // user is null (not undefined)
  if (!user) {
    onClientLoggedOut();
    return;
  }
  await onLoggedIn(user, redirect);
});

//
// updates
//

const changePassword = (password: string) => {
  const user = getAuth()?.currentUser;
  if (!user) return;

  updatePassword(user, password)
    .then(() => {
      toastInfo('Password changed successfully');
    })
    .catch((error) => {
      Logger.error('Failed to change password', error);
      toastError(`Failed to change password ${error}`);
    });
};

const resetPassword = (email?: string) => {
  const auth = getAuth();
  const userEmail = email || auth?.currentUser?.email;
  if (!userEmail) return;

  sendPasswordResetEmail(auth, userEmail)
    .then(() => {
      toastInfo('Sent email to reset password');
    })
    .catch((error) => {
      Logger.error('Failed to send email to reset password', error);
      toastError(`Failed to send email to reset password ${error}`);
    });
};

const changeProfile = ({ name, picture }: { name?: string, picture?: string }) => {
  const user = getAuth()?.currentUser;
  if (!user) return;

  updateProfile(user, {
    ...(name && { displayName: name }),
    ...(picture && { photoURL: picture }),
  })
    .then(() => {
      toastInfo('Profile changed successfully');
      window.location.reload();
    })
    .catch((error) => {
      Logger.error('Failed to change profile', error);
      toastError(`Failed to change profile ${error}`);
    });
};

export {
  authOnChange,
  cacheReadUserToken,
  changePassword,
  changeProfile,
  initFirebase,
  isSignInWithMagicLink,
  loginFromCache,
  loginOAuth,
  loginWithMagicLink,
  loginWithPassword,
  logout,
  refreshUserToken,
  resetPassword,
  sendMagicLink,
};
