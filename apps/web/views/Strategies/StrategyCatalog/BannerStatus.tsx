import storeStats from '@fishprovider/cross/dist/stores/stats';
import { useState } from 'react';

import Group from '~ui/core/Group';
import HtmlEditor from '~ui/core/HtmlEditor';
import Icon from '~ui/core/Icon';

function BannerStatus() {
  const bannerStatus = storeStats.useStore((state) => state.providers?.bannerStatus);
  const [showBanner, setShowBanner] = useState(true);

  if (!bannerStatus?.enabled || !showBanner) return null;

  return (
    <Group bg={bannerStatus.bgColor || 'lightseagreen'} position="apart">
      <HtmlEditor readOnly readOnlyValue={bannerStatus.notes} />
      <Icon name="Close" button onClick={() => setShowBanner(false)} />
    </Group>
  );
}

export default BannerStatus;
