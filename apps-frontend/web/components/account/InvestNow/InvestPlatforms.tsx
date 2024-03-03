import { Account, AccountPlatform, ProviderType } from '@fishprovider/core';
import _ from 'lodash';

import Link from '~components/base/Link';
import { watchAccountController } from '~controllers/account.controller';
import type { CopyPlatform } from '~types/CopyPlatform.model';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Stepper from '~ui/core/Stepper';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

const defaultUrlExness = 'https://social-trading.exness.com/strategy/11804543';
const defaultUrlRoboforex = 'https://www.copyfx.com/ratings/rating-all/show/264656?a=vtft';
const defaultUrlAlpari = 'https://www.alpari.com/en/invest/pamm/548473';

interface Props {
  providerId: string,
  platform: AccountPlatform,
  groupAccounts: Account[];
  platforms: Record<string, CopyPlatform>;
}

function InvestPlatforms({
  providerId, platform, groupAccounts, platforms,
}: Props) {
  const {
    name,
  } = watchAccountController((state) => ({
    name: state[providerId]?.name,
  }));

  const getCopyUrl = (copyPlatform: CopyPlatform, providerType: string) => {
    if (platform === AccountPlatform.ctrader) {
      const strategyId = groupAccounts[0]?.strategyId;
      const url = `${copyPlatform.copyUrl}/${strategyId}`;
      return url;
    }

    if (![
      ProviderType.myfxbook,
      // ProviderType.exness,
      // ProviderType.roboforex,
      // ProviderType.alpari,
    ].includes(providerType as ProviderType)) return '';

    const account = groupAccounts.find(
      (item) => item.strategyLinks?.find((link) => link.type === providerType),
    );
    const url = account?.strategyLinks?.find((link) => link.type === providerType)?.url;

    if (!url && providerType === ProviderType.exness) return defaultUrlExness;
    if (!url && providerType === ProviderType.roboforex) return defaultUrlRoboforex;
    if (!url && providerType === ProviderType.alpari) return defaultUrlAlpari;

    return url;
  };

  return (
    <Stack>
      <Title size="h4">Steps</Title>
      <Stepper active={0} orientation="vertical">
        <Stepper.Step
          label={(
            <Stack spacing="xs" pb="xl">
              <Text>
                Click on one of the following links to create an account at your preferred platform
              </Text>
              <Group>
                {_.map(platforms, (item) => (
                  <Link
                    key={item.name}
                    variant="noColor"
                    href={item.partnerUrl || item.href}
                    target="_blank"
                  >
                    <Stack align="center" spacing={0}>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fit="contain"
                        width={50}
                        height={50}
                      />
                      <Text>{item.name}</Text>
                    </Stack>
                  </Link>
                ))}
              </Group>
            </Stack>
          )}
        />
        <Stepper.Step
          label={(
            <Text>Deposit funds</Text>
          )}
        />
        <Stepper.Step
          label={(
            <Stack spacing="xs">
              <Text>
                Go to one of the following links to the
                {' '}
                <Text span c="blue" fw="bold">{name}</Text>
                {' '}
                strategy via your preferred platform, then click the
                {' '}
                <Text span c="green" fw="bold">Start Copying</Text>
                {' '}
                button (or
                {' '}
                <Text span c="green" fw="bold">Invest</Text>
                {' '}
                button)
              </Text>
              {_.map(platforms, (item, providerType) => {
                const url = getCopyUrl(item, providerType);
                return (
                  <Link key={item.name} variant="noColor" href={url} target="_blank">
                    <Group>
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fit="contain"
                        width={20}
                        height={20}
                      />
                      {url || 'Coming soon...'}
                    </Group>
                  </Link>
                );
              })}
            </Stack>
          )}
        />
      </Stepper>
    </Stack>
  );
}

export default InvestPlatforms;
