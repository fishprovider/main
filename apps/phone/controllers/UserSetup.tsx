// import UserAnalytics from './UserAnalytics';
import UserAuth from './UserAuth';
import UserPushNotif from './UserPushNotif';
// import UserClean from './UserClean';
// import UserLiveChat from './UserLiveChat';
// import UserNotif from './UserNotif';
// import UserSocket from './UserSocket';
// import UserTheme from './UserTheme';

function UserSetup() {
  return (
    <>
      <UserAuth />
      <UserPushNotif />
      {/* <UserSocket /> */}
      {/* <UserTheme /> */}
      {/* <UserLiveChat /> */}
      {/* <UserClean /> */}
    </>
  );
}

export default UserSetup;
