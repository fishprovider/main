import { ApiConfig, apiPost } from '~libs/api';
import storeUser from '~stores/user';

const userLogout = async (
  options?: ApiConfig,
) => {
  await apiPost('/auth/logout', {}, options);
  storeUser.mergeState({
    isServerLoggedIn: false,
    info: null,
  });
};

export default userLogout;
