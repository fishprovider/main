import { useState } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';
import HtmlEditor from '~ui/core/HtmlEditor';
import Icon from '~ui/core/Icon';

function BannerStatus() {
  const bannerStatus = watchUserInfoController((state) => state.activeAccount?.bannerStatus);

  const [showBanner, setShowBanner] = useState(true);

  if (!bannerStatus?.enabled || !showBanner) return null;

  return (
    <Group p="sm" bg={bannerStatus.bgColor || 'lightseagreen'} position="apart">
      <HtmlEditor readOnly readOnlyValue={bannerStatus.notes} />
      <Icon name="Close" button onClick={() => setShowBanner(false)} />
    </Group>
  );
}

export default BannerStatus;
