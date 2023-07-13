import PushNotif from '~components/PushNotif';
import UserController from '~controllers/UserController';

export default function Wallet() {
  return (
    <UserController>
      <PushNotif />
    </UserController>
  );
}
