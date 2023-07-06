import accountGetManySlim from '@fishbot/cross/api/accounts/getManySlim';
import { queryKeys } from '@fishbot/cross/constants/query';
import { useQuery } from '@fishbot/cross/libs/query';
import storeAccounts from '@fishbot/cross/stores/accounts';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import Button from '~ui/Button';
import Card from '~ui/Card';
import Group from '~ui/Group';
import H6 from '~ui/H6';
import { useModalSimple } from '~ui/ModalProvider';
import ScrollView from '~ui/ScrollView';
import Stack from '~ui/Stack';
import Text from '~ui/Text';
import { useToast } from '~ui/ToastProvider';

// const pageSizeOptions = ['5', '10', '20', '50', '100'];
const pageSizeDefault = 10;

interface Props {
  providerId: string;
}

function ProviderCard({ providerId }: Props) {
  const toast = useToast();

  const {
    name = '-',
    icon = '-',
    createdAt,
    // riskScore,
    // winRate,
    maxYearProfit = 0,
    roi = 0,
    summary = {},
  } = storeAccounts.useStore((state) => ({
    name: state[providerId]?.name,
    icon: state[providerId]?.icon,
    createdAt: state[providerId]?.createdAt,
    // riskScore: state[providerId]?.riskScore,
    // winRate: state[providerId]?.winRate,
    maxYearProfit: state[providerId]?.maxYearProfit,
    roi: state[providerId]?.roi,
    summary: state[providerId]?.summary,
  }));

  const profit = summary?.roi || roi || 0;
  const activeMonths = moment().diff(moment(createdAt), 'months') + 1;

  const [showModal, hideModal] = useModalSimple({
    title: `Invest in ${name}`,
    description: 'Coming soon',
  });

  const onInvest = () => {
    toast.show('Coming soon');
    showModal();
    setTimeout(() => hideModal(), 2000);
  };

  return (
    <Card elevate bordered>
      <Card.Header padded>
        <Group>
          <Stack space="$2" width={150}>
            <H6>{name}</H6>
            <Text>{icon}</Text>
            <Button color="white" backgroundColor="green" size="$3" width={110} onPress={onInvest}>
              Invest ➜ 🏦
            </Button>
          </Stack>
          <Stack space="$2" justifyContent="center">
            <Text>
              Target:
              {' '}
              <Text color="orange">{`${maxYearProfit}%/year`}</Text>
            </Text>
            <Text>
              All-Time Profit:
              {' '}
              <Text color="green">{`${profit}%`}</Text>
            </Text>
            <Text>
              Active:
              {' '}
              <Text color="blue">
                {moment.duration(moment().diff(moment(createdAt))).humanize()}
              </Text>
            </Text>
            <Text>
              Avg. Profit:
              {' '}
              <Text color="purple">{`${_.round(profit / activeMonths, 2)}%/month`}</Text>
            </Text>
          </Stack>
        </Group>
      </Card.Header>
    </Card>
  );
}

export default function Invest() {
  const [page, _setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(pageSizeDefault);

  const providerIds = storeAccounts.useStore((state) => _.orderBy(
    _.filter(state, (account) => {
      if (!account.strategyId) return false;
      if (account.providerGroupId && account.providerGroupId !== account._id) return false;
      // if (favorite && !starProviders[account._id]) return false;
      // if (search && !account.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [
      (account) => account.order || 0,
      (account) => account.name,
    ],
    ['desc', 'asc'],
  )
    .slice((page - 1) * pageSize, page * pageSize)
    .map((account) => account._id));

  useQuery({
    queryFn: accountGetManySlim,
    queryKey: queryKeys.slimAccounts(),
  });

  return (
    <ScrollView>
      <Stack>
        {providerIds.map((providerId) => (
          <ProviderCard key={providerId} providerId={providerId} />
        ))}
      </Stack>
    </ScrollView>
  );
}
