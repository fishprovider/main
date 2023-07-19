import getUser from '@fishprovider/cross/dist/api/user/getUser';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

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
    queryFn: () => getUser({}),
    queryKey: queryKeys.user(userId),
    enabled: !!userId,
    refetchInterval: refreshMS,
  });

  if (phoneNumber) return null;

  return <VerifyPhone />;
}

export default RequiredVerifyPhone;
