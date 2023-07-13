import User from '~components/User';
import UserController from '~controllers/UserController';

export default function Account() {
  return (
    <UserController>
      <User />
    </UserController>
  );
}
