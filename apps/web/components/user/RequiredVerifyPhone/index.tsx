import userGetInfo from '@fishbot/cross/api/users/getInfo';
import { useQuery } from '@fishbot/cross/libs/query';
import storeUser from '@fishbot/cross/stores/user';

import VerifyPhone from '~components/user/VerifyPhone';
import { queryKeys } from '~constants/query';
import { refreshMS } from '~utils';

function RequiredVerifyPhone() {
  const {
    userId,
    phoneNumber,
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    phoneNumber: state.info?.telegram?.phoneNumber,
  }));

  useQuery({
    queryFn: () => userGetInfo({}),
    queryKey: queryKeys.user(userId),
    enabled: !!userId,
    refetchInterval: refreshMS,
  });

  if (phoneNumber) return null;

  return <VerifyPhone />;
}

export default RequiredVerifyPhone;
