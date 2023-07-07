import type { User } from '@fishbot/utils/types/User.model';

function authOnChange(
  onClientLoggedIn: (user: User, token: string) => void,
  onClientLoggedOut: () => void,
) {
  console.log('authOnChange', onClientLoggedIn, onClientLoggedOut);
}

export {
  authOnChange,
};
