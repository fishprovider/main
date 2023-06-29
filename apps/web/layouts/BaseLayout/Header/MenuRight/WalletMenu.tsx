import Routes from '~libs/routes';
import Icon from '~ui/core/Icon';

function WalletMenu() {
  return (
    <Icon name="AccountBalanceWallet" color="teal" button href={Routes.wallet} tooltip="Wallet" />
  );
}

export default WalletMenu;
