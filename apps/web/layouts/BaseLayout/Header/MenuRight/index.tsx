import Group from '~ui/core/Group';

import AccountMenu from './AccountMenu';
import LiveModeSwitch from './LiveModeSwitch';
import UserMenu from './UserMenu';
import WalletMenu from './WalletMenu';

function MenuRight() {
  return (
    <Group p={5}>
      <AccountMenu />
      <WalletMenu />
      <LiveModeSwitch />
      <UserMenu />
    </Group>
  );
}

export default MenuRight;
