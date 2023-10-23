import Routes from '~libs/routes';
import Switch from '~ui/core/Switch';
import Text from '~ui/core/Text';
import { demoProdHostnameDefault, isLive, prodHostnameDefault } from '~utils';

function LiveModeSwitch() {
  return (
    <Switch
      onLabel={<Text size="sm">Live</Text>}
      offLabel={<Text size="sm">Demo</Text>}
      color="green"
      checked={isLive}
      onChange={(event) => {
        const url = new URL(window.location.href);
        url.hostname = event.target.checked ? prodHostnameDefault : demoProdHostnameDefault;
        url.pathname = Routes.strategies;
        window.location.href = url.href;
      }}
    />
  );
}

export default LiveModeSwitch;
