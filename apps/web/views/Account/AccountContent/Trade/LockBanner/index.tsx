import lockAccount from '@fishprovider/cross/dist/api/accounts/lock/account';
import lockMember from '@fishprovider/cross/dist/api/accounts/lock/member';
import storeUser from '@fishprovider/cross/dist/stores/user';

import LockStatus from '~components/account/LockStatus';
import Box from '~ui/core/Box';
import Stack from '~ui/core/Stack';
import { toastError } from '~ui/toast';

function LockBanner() {
  const {
    userId = '',
    providerId = '',
    members = [],
    locks = [],
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    providerId: state.activeProvider?._id,
    members: state.activeProvider?.members,
    locks: state.activeProvider?.locks,
  }));

  const renderAccountLocks = () => locks.map((lock, index) => (
    <Box key={index} bg="gray" p="sm">
      <LockStatus
        lock={lock}
        unlock={() => {
          lockAccount({
            providerId,
            lock,
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
              providerId,
              userId,
              lock,
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
