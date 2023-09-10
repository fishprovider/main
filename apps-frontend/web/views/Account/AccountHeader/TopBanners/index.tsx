import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';

import Box from '~ui/core/Box';
import Stack from '~ui/core/Stack';

import BigNews from './BigNews';
import BigNewsNear from './BigNewsNear';

function TopBanners() {
  const banners = storeUser.useStore((state) => state.banners);

  const onClose = (bannerId: string) => {
    storeUser.mergeState({ banners: _.omit(banners, bannerId) });
  };

  const renderBanner = (bannerId: string) => {
    switch (bannerId) {
      case 'BigNews':
        return <BigNews onClose={() => onClose(bannerId)} />;
      case 'BigNewsNear':
        return <BigNewsNear onClose={() => onClose(bannerId)} />;
      default:
        return null;
    }
  };

  return (
    <Stack>
      {_.map(banners, (isEnabled, bannerId) => isEnabled && (
        <Box key={bannerId}>
          {renderBanner(bannerId)}
        </Box>
      ))}
    </Stack>
  );
}

export default TopBanners;
