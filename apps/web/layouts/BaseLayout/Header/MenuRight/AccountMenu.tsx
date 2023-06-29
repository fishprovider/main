import Routes from '~libs/routes';
import Icon from '~ui/core/Icon';

function AccountMenu() {
  return (
    <Icon name="CandlestickChart" color="teal" button href={Routes.accounts} tooltip="Accounts" />
  );
}

export default AccountMenu;
