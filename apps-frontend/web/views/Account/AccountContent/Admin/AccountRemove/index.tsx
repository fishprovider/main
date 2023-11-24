import { useRouter } from 'next/router';

import { removeAccountController } from '~controllers/account.controller';
import { getUserInfoController } from '~controllers/user.controller';
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
    const accountId = getUserInfoController().activeAccount?._id || '';

    if (!(await openConfirmModal())) return;

    await removeAccountController({ accountId });

    router.push(Routes.strategies);
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
