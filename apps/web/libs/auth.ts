import type { User } from '@fishbot/utils/types/User.model';
import type { FirebaseError } from 'firebase/app';
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

interface UserToken {
  token: string,
  createdAt: Date
}
const cacheKeyUserToken = 'fp-userToken';

//
// login/out
//

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

const loginOAuth = (method: LoginMethods) => {
  const { authMethod, credentialFromError } = getAuthMethod(method);
  if (authMethod && credentialFromError) {
    const auth = getAuth();
    signInWithPopup(auth, authMethod)
      .catch((error) => errorHandler(error, auth, credentialFromError));
  }
};

const loginWithPassword = (email: string, password: string, isLogin: boolean) => {
  const auth = getAuth();
  if (isLogin) {
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      Logger.error(err);
      toastError(`Failed to login: ${err.message}`);
    });
  } else {
    createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      Logger.error(err);
      toastError(`Failed to signup: ${err.message}`);
    });
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

const loginWithMagicLink = (email: string) => {
  signInWithEmailLink(getAuth(), email, window.location.href)
    .then(() => {
      toastInfo('Logged in with magic link successfully');
    })
    .catch((error) => {
      Logger.error('Failed to login with magic link', error);
      toastError(`Failed to login with magic link ${error}`);
    });
};

const cacheWriteUserToken = (userToken?: UserToken) => cacheWrite(cacheKeyUserToken, userToken);

const cacheReadUserToken = () => cacheRead<UserToken>(cacheKeyUserToken);

const logout = async () => {
  cacheWriteUserToken();

  await getAuth().signOut().then(() => {
    toastInfo('Logged out successfully');
    window.location.reload();
  });
};

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

const refreshUserToken = async () => {
  const user = getAuth()?.currentUser;
  if (!user) return undefined;
  return getUserToken(user, true);
};

const getUserAuthInfo = (userAuth: UserAuth, field: keyof UserInfo) => userAuth[field]
  || userAuth.providerData.find((item) => item[field])?.[field] || '';

const authOnChange = (
  onClientLoggedIn: (user: User, token: string) => void,
  onClientLoggedOut: () => void,
) => {
  const unsub = getAuth().onAuthStateChanged(async (user) => {
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
};

//
// account updates
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
  isSignInWithMagicLink,
  loginOAuth,
  loginWithMagicLink,
  loginWithPassword,
  logout,
  refreshUserToken,
  resetPassword,
  sendMagicLink,
};
