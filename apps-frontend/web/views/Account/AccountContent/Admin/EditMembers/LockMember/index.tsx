import lockMember from '@fishprovider/cross/dist/api/accounts/lock/member';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { Lock, Member } from '@fishprovider/utils/dist/types/Account.model';

import LockAction from '~components/account/LockAction';
import LockStatus from '~components/account/LockStatus';
import { toastError } from '~ui/toast';

interface Props {
  member: Member
}

function LockMember({ member }: Props) {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  const onUnlock = (lock: Lock) => {
    lockMember({
      providerId,
      userId: member.userId,
      lock,
      unlock: true,
    }).catch((err) => {
      toastError(`Failed to unlock: ${err.message}`);
    });
  };

  return (
    <>
      {member.locks?.map((lock, index) => (
        <LockStatus key={index} lock={lock} unlock={() => onUnlock(lock)} />
      ))}
      <LockAction providerId={providerId} userId={member.userId} />
    </>
  );
}

export default LockMember;
