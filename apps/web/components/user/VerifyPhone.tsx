import getUser from '@fishprovider/cross/dist/api/user/getUser';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import Link from '~components/base/Link';
// import TelegramLogin from '~components/view/TeleLogin';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

const botName = 'fishprovider_verify_bot';

function VerifyPhone() {
  const {
    phoneNumber,
  } = storeUser.useStore((state) => ({
    phoneNumber: state.info?.telegram?.phoneNumber,
  }));

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: () => getUser({ filter: {} }),
  });

  return (
    <Stack>
      <Title size="h2">Phone Verification</Title>
      {/* <TelegramLogin dataOnAuth={onPhoneVerified} botName={botName} /> */}
      {phoneNumber ? (
        <Stack>
          <Group spacing="xs">
            <Text>
              Phone:
              {' '}
              {phoneNumber}
            </Text>
            ✅
            <Link href={`https://t.me/${botName}`} target="_blank" variant="noColor">Verified</Link>
          </Group>
        </Stack>
      ) : (
        <Group>
          <Link href={`https://t.me/${botName}`} target="_blank" variant="noColor">
            <Button>Verify</Button>
          </Link>
          <Icon name="Sync" button onClick={reload} loading={isLoadingReload} tooltip="Refresh" />
        </Group>
      )}
    </Stack>
  );
}

export default VerifyPhone;
