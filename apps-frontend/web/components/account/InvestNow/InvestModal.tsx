import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import { useState } from 'react';

import {
  ctraderPlatforms, metatraderPlatforms,
} from '~constants/account';
import { watchAccountController } from '~controllers/account.controller';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';

import InvestFish from './InvestFish';
import InvestPlatforms from './InvestPlatforms';

interface Props {
  providerId: string;
  onClose?: () => void;
}

function InvestModal({
  providerId,
  onClose = () => undefined,
}: Props) {
  const {
    groupId,
  } = watchAccountController((state) => ({
    groupId: state[providerId]?.groupId,
  }));

  const groupAccounts = watchAccountController((state) => _.filter(
    state,
    (item) => (groupId
      ? item.groupId === groupId
      : item._id === providerId),
  ));

  const canInvestCTrader = groupAccounts.some(
    (item) => item.platform === AccountPlatform.ctrader,
  );
  const canInvestMetaTrader = groupAccounts.some(
    (item) => item.platform === AccountPlatform.metatrader,
  );

  const platforms: { label: string, value: AccountPlatform }[] = [
    { label: 'CTrader (Spotware)', value: AccountPlatform.ctrader },
    { label: 'MetaTrader (MT4/MT5)', value: AccountPlatform.metatrader },
    { label: 'FishCT (FishPlatform)', value: AccountPlatform.fishct },
  ];

  const [platformInput, setPlatformInput] = useState<AccountPlatform>(AccountPlatform.ctrader);

  const getDefaultPlatform = () => {
    if (canInvestCTrader) return AccountPlatform.ctrader;
    if (canInvestMetaTrader) return AccountPlatform.metatrader;
    return AccountPlatform.fishct;
  };
  const platform = platformInput || getDefaultPlatform();

  const renderContent = () => {
    switch (platform) {
      case AccountPlatform.ctrader: return (
        <InvestPlatforms
          providerId={providerId}
          platform={platform}
          groupAccounts={groupAccounts.filter((item) => item.platform === platform)}
          platforms={ctraderPlatforms}
        />
      );
      case AccountPlatform.metatrader: return (
        <InvestPlatforms
          providerId={providerId}
          platform={platform}
          groupAccounts={groupAccounts.filter((item) => item.platform === platform)}
          platforms={metatraderPlatforms}
        />
      );
      case AccountPlatform.fishct: return (
        <InvestFish
          providerId={providerId}
          onClose={onClose}
        />
      );
      default: return null;
    }
  };

  return (
    <Stack>
      <Select
        label="Select your preferred platform"
        data={platforms}
        value={platform}
        onChange={(value) => {
          if (value) setPlatformInput(value as AccountPlatform);
        }}
        size="md"
      />
      {renderContent()}
      <Group position="right">
        <Button variant="subtle" onClick={onClose}>Close</Button>
      </Group>
    </Stack>
  );
}

export default InvestModal;
