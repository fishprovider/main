import storeUser from '@fishprovider/cross/stores/user';

import Login from '~components/Login';

interface Props {
  children: React.ReactNode;
}

function UserController({ children }: Props) {
  const isServerLoggedIn = storeUser.useStore((state) => state.isServerLoggedIn);

  if (!isServerLoggedIn) {
    return <Login />;
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {children}
    </>
  );
}

export default UserController;
