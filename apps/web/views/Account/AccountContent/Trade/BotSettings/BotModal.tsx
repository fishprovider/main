import Button from '~ui/core/Button';
import Divider from '~ui/core/Divider';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';

import AdminSettings from './AdminSettings';
import ProtectSettings from './ProtectSettings';
import TradeSettings from './TradeSettings';

interface Props {
  onClose?: () => void;
}

function BotModal({ onClose }: Props) {
  return (
    <Stack>
      <TradeSettings onClose={onClose} />
      <Divider />
      <ProtectSettings onClose={onClose} />
      <Divider />
      <AdminSettings onClose={onClose} />
      <Group position="right">
        <Button onClick={onClose} variant="subtle">Close</Button>
      </Group>
    </Stack>
  );
}

export default BotModal;
