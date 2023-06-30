const preLoginPageKey = 'preLoginPage';

const setPreLoginPage = (redirectUrl: string) => {
  sessionStorage.setItem(preLoginPageKey, decodeURIComponent(redirectUrl));
};

const redirectPreLoginPage = (redirect: (redirectUrl: string) => void) => {
  const preLoginPage = sessionStorage.getItem(preLoginPageKey);
  if (preLoginPage) {
    Logger.info(`Redirect to preLoginPage: ${preLoginPage}`);
    sessionStorage.removeItem(preLoginPageKey);
    redirect(preLoginPage);
  }
};

export {
  redirectPreLoginPage,
  setPreLoginPage,
};
