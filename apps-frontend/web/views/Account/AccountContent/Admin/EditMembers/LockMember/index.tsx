import lockMember from '@fishprovider/cross/dist/api/accounts/lock/member';
import type { Lock, Member } from '@fishprovider/utils/dist/types/Account.model';

import LockAction from '~components/account/LockAction';
import LockStatus from '~components/account/LockStatus';
import { watchUserInfoController } from '~controllers/user.controller';
import { toastError } from '~ui/toast';

interface Props {
  member: Member
}

function LockMember({ member }: Props) {
  const {
    providerId = '',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
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
