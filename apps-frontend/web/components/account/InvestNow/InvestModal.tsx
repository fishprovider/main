import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import { useState } from 'react';

import {
  ctraderPlatforms, metatraderPlatforms,
} from '~constants/account';
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
    providerGroupId,
  } = storeAccounts.useStore((state) => ({
    providerGroupId: state[providerId]?.providerGroupId,
  }));

  const groupAccounts = storeAccounts.useStore((state) => _.filter(
    state,
    (item) => (providerGroupId
      ? item.providerGroupId === providerGroupId
      : item._id === providerId),
  ));

  const canInvestCTrader = groupAccounts.some(
    (item) => item.accountPlatform === AccountPlatform.ctrader,
  );
  const canInvestMetaTrader = groupAccounts.some(
    (item) => item.accountPlatform === AccountPlatform.metatrader,
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
          accountPlatform={platform}
          groupAccounts={groupAccounts.filter((item) => item.accountPlatform === platform)}
          platforms={ctraderPlatforms}
        />
      );
      case AccountPlatform.metatrader: return (
        <InvestPlatforms
          providerId={providerId}
          accountPlatform={platform}
          groupAccounts={groupAccounts.filter((item) => item.accountPlatform === platform)}
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
