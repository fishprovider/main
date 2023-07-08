import { apiPost } from '@fishprovider/cross/libs/api';
import { useState } from 'react';

import Button from '~ui/core/Button';
import Icon from '~ui/core/Icon';
import Radio from '~ui/core/Radio';
import Stack from '~ui/core/Stack';
import { isLive } from '~utils';

function AccountCTrader() {
  const [scope, setScope] = useState('trading');

  return (
    <>
      <Radio.Group
        label="Permission"
        value={scope}
        onChange={(value) => setScope(value)}
      >
        <Stack spacing="xs">
          <Radio value="accounts" label="View Only" />
          <Radio value="trading" label="Allow Trading via FishProvider" />
        </Stack>
      </Radio.Group>
      <span>
        <Button
          onClick={async () => {
            const url = await apiPost<string>('/accounts/ctrader/getAuthUrl', {
              origin: window.location.origin,
              scope,
              live: isLive,
            });
            window.location.href = url;
          }}
          rightIcon={<Icon name="SystemUpdateAlt" />}
        >
          Import from CTrader
        </Button>
      </span>
    </>
  );
}

export default AccountCTrader;
