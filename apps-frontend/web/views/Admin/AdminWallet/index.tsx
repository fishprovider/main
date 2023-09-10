import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { apiPost } from '@fishprovider/cross/dist/libs/api';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeWallets from '@fishprovider/cross/dist/stores/wallets';
import { InvestStatus, WalletType } from '@fishprovider/utils/dist/constants/pay';
import type { Wallet } from '@fishprovider/utils/dist/types/Pay.model';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';
import { refreshMS } from '~utils';

import AdminInvestModal from './AdminInvestModal';

const doneStatuses = [
  InvestStatus.active,
  InvestStatus.inactive,
];

function AdminWallet() {
  const wallets = storeWallets.useStore((state) => _.filter(
    state,
    (item) => item.type === WalletType.invest
      && !!item.investStatus
      && !doneStatuses.includes(item.investStatus),
  ));

  const manualGetManyInvest = async () => {
    const docs = await apiPost<Wallet[]>('/manual/getManyInvest');
    storeWallets.mergeDocs(docs);
    return docs;
  };

  useQuery({
    queryFn: () => manualGetManyInvest(),
    queryKey: queryKeys.investRequests(),
    refetchInterval: refreshMS,
  });

  const onEdit = (walletId: string) => openModal({
    title: <Title size="h4">Invest Action</Title>,
    content: <AdminInvestModal walletId={walletId} />,
  });

  const renderRow = (wallet: Wallet, rowIndex: number) => {
    const {
      _id: walletId, balance, currency, investStatus, investData, createdAt,
    } = wallet;
    const { providerId, providerName, startedAt } = investData || {};
    return (
      <Table.Row>
        <Table.Cell>{`#${rowIndex + 1}`}</Table.Cell>
        <Table.Cell>{providerName || providerId}</Table.Cell>
        <Table.Cell>{`${balance} ${currency}`}</Table.Cell>
        <Table.Cell>{`${_.upperFirst(investStatus)} ${startedAt ? 'Stop' : ''}`}</Table.Cell>
        <Table.Cell>{moment(createdAt).fromNow()}</Table.Cell>
        <Table.Cell>{new Date(createdAt).toLocaleString()}</Table.Cell>
        <Table.Cell>
          <Icon name="Settings" button onClick={() => onEdit(walletId)} tooltip="Settings" />
        </Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Stack py="lg">
      <Title>💰💰💰 Invest 💰💰💰</Title>
      <Table>
        <Table.TBody>
          {_.orderBy(wallets, ['createdAt'], ['asc']).map(renderRow)}
        </Table.TBody>
      </Table>
    </Stack>
  );
}

export default AdminWallet;
