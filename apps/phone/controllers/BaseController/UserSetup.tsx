// import UserAnalytics from './UserAnalytics';
import UserAuth from './UserAuth';
import UserNotif from './UserNotif';
// import UserClean from './UserClean';
// import UserLiveChat from './UserLiveChat';
// import UserNotif from './UserNotif';
// import UserSocket from './UserSocket';
// import UserTheme from './UserTheme';

function UserSetup() {
  return (
    <>
      <UserAuth />
      <UserNotif />
      {/* <UserSocket /> */}
      {/* <UserTheme /> */}
      {/* <UserLiveChat /> */}
      {/* <UserClean /> */}
    </>
  );
}

export default UserSetup;
