import storeUser from '@fishprovider/cross/stores/user';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Lock } from '@fishprovider/utils/types/Account.model';
import moment from 'moment';

import LockTypeInfo from '~components/account/LockTypeInfo';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';

interface Props {
  lock?: Lock;
  unlock: () => void;
}

function LockStatus({ lock, unlock }: Props) {
  const { roles, providerId } = storeUser.useStore((state) => ({
    roles: state.info?.roles,
    providerId: state.activeProvider?._id,
  }));

  if (!lock) return null;

  const {
    lockUntil,
    lockMessage,
    lockByUserName,
  } = lock;

  const { isAdminWeb, isTraderProvider, isProtectorProvider } = getRoleProvider(roles, providerId);

  return (
    <Stack spacing="xs">
      {(isAdminWeb || moment(lockUntil) < moment())
        && (isTraderProvider || isProtectorProvider) && (
        <Box>
          <Button color="green" onClick={unlock}>
            Lock ended - Unlock now
          </Button>
        </Box>
      )}
      <LockTypeInfo lock={lock} />
      <Text>{lockMessage}</Text>
      <Text size="xs">{`Locked by ${lockByUserName} until ${moment(lockUntil).toLocaleString()}`}</Text>
    </Stack>
  );
}

export default LockStatus;
