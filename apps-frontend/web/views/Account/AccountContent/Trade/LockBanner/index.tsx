import lockAccount from '@fishprovider/cross/dist/api/accounts/lock/account';
import lockMember from '@fishprovider/cross/dist/api/accounts/lock/member';

import LockStatus from '~components/account/LockStatus';
import { watchUserInfoController } from '~controllers/user.controller';
import Box from '~ui/core/Box';
import Stack from '~ui/core/Stack';
import { toastError } from '~ui/toast';

function LockBanner() {
  const {
    userId = '',
    accountId = '',
    members = [],
    locks = [],
  } = watchUserInfoController((state) => ({
    userId: state.activeUser?._id,
    accountId: state.activeAccount?._id,
    members: state.activeAccount?.members,
    locks: state.activeAccount?.locks,
  }));

  const renderAccountLocks = () => locks.map((lock, index) => (
    <Box key={index} bg="gray" p="sm">
      <LockStatus
        lock={lock}
        unlock={() => {
          lockAccount({
            providerId: accountId,
            lock: lock as any,
            unlock: true,
          }).catch((err) => {
            toastError(`Failed to unlock: ${err.message}`);
          });
        }}
      />
    </Box>
  ));

  const renderUserLocks = () => members.find((item) => item.userId === userId)
    ?.locks?.map((lock, index) => (
      <Box key={index} bg="gray" p="sm">
        <LockStatus
          lock={lock}
          unlock={() => {
            lockMember({
              providerId: accountId,
              userId,
              lock: lock as any,
              unlock: true,
            }).catch((err) => {
              toastError(`Failed to unlock: ${err.message}`);
            });
          }}
        />
      </Box>
    ));

  return (
    <Stack>
      {renderAccountLocks()}
      {renderUserLocks()}
    </Stack>
  );
}

export default LockBanner;
