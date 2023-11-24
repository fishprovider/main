import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';

import BotChips from '~components/account/BotChips';
import { watchUserInfoController } from '~controllers/user.controller';
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
  } = watchUserInfoController((state) => ({
    tradeSettings: state.activeAccount?.tradeSettings,
    protectSettings: state.activeAccount?.protectSettings,
    settings: state.activeAccount?.settings,
    providerId: state.activeAccount?._id,
    roles: state.activeUser?.roles,
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
