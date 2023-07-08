import accountRemove from '@fishprovider/cross/api/accounts/remove';
import storeUser from '@fishprovider/cross/stores/user';
import { useRouter } from 'next/router';

import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';

function AccountRemove() {
  const router = useRouter();

  const onRemove = async () => {
    const providerId = storeUser.getState().activeProvider?._id || '';

    if (!(await openConfirmModal())) return;

    await accountRemove({
      providerId,
    }).then(() => {
      router.push(Routes.strategies);
    });
  };

  return (
    <Stack>
      <Title size="h4">☠️ Danger Zone</Title>
      <Group>
        <Button
          onClick={onRemove}
          rightIcon={<Icon name="Delete" />}
          color="red"
        >
          Remove Account
        </Button>
      </Group>
    </Stack>
  );
}

export default AccountRemove;
