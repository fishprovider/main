import { Account, AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import _ from 'lodash';
import { useRef } from 'react';

import Link from '~components/base/Link';
import { TopAccounts } from '~constants/account';
import { getAccountsController, watchAccountController } from '~controllers/account.controller';
import Routes from '~libs/routes';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Flex from '~ui/core/Flex';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

import ProviderCardTop from './ProviderCardTop';

function TopStrategies() {
  const sliderScroll = useRef<HTMLDivElement>(null);

  const topProviderIds = watchAccountController((state) => {
    const topAccounts = _.orderBy(
      _.reduce(
        state,
        (acc: Account[], account) => {
          if (account.rank !== 'top') return acc;

          const { roi, summary } = account;
          const roiFinal = summary?.roi || roi || 0;
          if (roiFinal <= 0) return acc;

          acc.push({ ...account, roi: roiFinal });
          return acc;
        },
        [],
      ),
      ['order', 'roi'],
      ['desc', 'desc'],
    );

    const topProviders = _.reduce(
      _.groupBy(topAccounts, 'providerGroupId'),
      (acc: Account[], accounts, providerGroupId) => {
        if (providerGroupId === 'undefined') return [...acc, ...accounts];

        const topAccount = _.maxBy(accounts, (item) => item.roi);
        if (!topAccount) return acc;

        acc.push(topAccount);
        return acc;
      },
      [],
    );

    return topProviders.map((account) => account._id);
  });

  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });

  const slide = (shift: number) => {
    const ele = sliderScroll.current;
    if (ele) {
      ele.scrollLeft += shift;
    }
  };

  const topIds = _.uniq([...TopAccounts.map((item) => item._id), ...topProviderIds]);

  return (
    <Stack id="strategies" py={50}>
      <Box>
        <Title ta="center" size="h2">Top Strategies</Title>
        <Text ta="center">Click on the card for more details</Text>
      </Box>
      <Box h={380}>
        <Box ref={sliderScroll} sx={{ overflowX: 'auto' }}>
          <Flex gap="md" py="xl">
            {topIds.map((providerId) => (
              <ProviderCardTop key={providerId} providerId={providerId} />
            ))}
          </Flex>
        </Box>
      </Box>

      <ContentSection>
        <Group position="apart">
          <Box w={70} />
          <Link href={Routes.strategies} variant="clean">
            <Button size="md">See All ➜</Button>
          </Link>
          <Group position="right">
            <Icon name="ArrowBack" size="large" color="primary" button onClick={() => slide(-250)} />
            <Icon name="ArrowForward" size="large" color="primary" button onClick={() => slide(250)} />
          </Group>
        </Group>
      </ContentSection>
    </Stack>
  );
}

export default TopStrategies;
