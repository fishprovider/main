import storeUser from '@fishprovider/cross/stores/user';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';

import BotChips from '~components/account/BotChips';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import BotModal from './BotModal';

function BotSettings() {
  const {
    tradeSettings,
    protectSettings,
    settings,
    roles,
    providerId,
  } = storeUser.useStore((state) => ({
    tradeSettings: state.activeProvider?.tradeSettings,
    protectSettings: state.activeProvider?.protectSettings,
    settings: state.activeProvider?.settings,
    providerId: state.activeProvider?._id,
    roles: state.info?.roles,
  }));
  const { isTraderProvider, isProtectorProvider } = getRoleProvider(roles, providerId);

  const onEdit = () => {
    openModal({
      title: <Title size="h4">Bot Settings</Title>,
      content: <BotModal />,
    });
  };

  return (
    <Stack>
      {(isTraderProvider || isProtectorProvider) && (
        <Group spacing="sm">
          <Title size="h4">🤖 Bot Settings</Title>
          <Icon name="Edit" button onClick={onEdit} tooltip="Edit Settings" />
        </Group>
      )}
      <BotChips
        tradeSettings={tradeSettings}
        protectSettings={protectSettings}
        settings={settings}
      />
    </Stack>
  );
}

export default BotSettings;
