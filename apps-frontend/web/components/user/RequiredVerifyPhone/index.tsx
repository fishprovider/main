import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';

import VerifyPhone from '~components/user/VerifyPhone';
import { getUserController, watchUserInfoController } from '~controllers/user.controller';
import { refreshMS } from '~utils';

function RequiredVerifyPhone() {
  const {
    userId,
    phoneNumber,
  } = watchUserInfoController((state) => ({
    userId: state.activeUser?._id,
    phoneNumber: state.activeUser?.telegram?.phoneNumber,
  }));

  useQuery({
    queryFn: () => getUserController({}),
    queryKey: queryKeys.user(userId),
    enabled: !!userId,
    refetchInterval: refreshMS,
  });

  if (phoneNumber) return null;

  return <VerifyPhone />;
}

export default RequiredVerifyPhone;
