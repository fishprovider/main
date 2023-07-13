import accountGet from '@fishprovider/cross/api/accounts/get';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';
import { useEffect } from 'react';

import { queryKeys } from '~constants/query';
import useWatchAccount from '~hooks/useWatchAccount';
import { subNotif, unsubNotif } from '~libs/pushNotif';
import { refreshMS } from '~utils';

interface Props {
  providerId: string;
}

function AccountWatch({ providerId }: Props) {
  const {
    isServerLoggedIn,
    isStar,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    isStar: state.info?.starProviders?.[providerId],
  }));

  useEffect(() => {
    accountGet({ providerId, reload: true });
  }, [providerId]);

  useQuery({
    queryFn: () => accountGet({ providerId }),
    queryKey: queryKeys.account(providerId),
    refetchInterval: refreshMS,
  });

  useWatchAccount(providerId);

  useEffect(() => {
    if (isServerLoggedIn) {
      if (isStar) {
        Logger.debug('[notif] subNotif', providerId);
        subNotif(providerId);
      } else {
        Logger.debug('[notif] unsubNotif', providerId);
        unsubNotif(providerId);
      }
    }
    return () => undefined;
  }, [isServerLoggedIn, isStar, providerId]);

  return null;
}

export default AccountWatch;
