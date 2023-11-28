import { watchUserInfoController } from '~controllers/user.controller';
import Login from '~views/Login';

interface Props {
  children: React.ReactNode;
}

function UserProvider({ children }: Props) {
  const isServerLoggedIn = watchUserInfoController((state) => state.isServerLoggedIn);

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

export default UserProvider;
