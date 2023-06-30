import { getProfitIcon } from '@fishbot/utils/helpers/order';
import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';

import OrderActivities from '~components/order/OrderActivities';
import OrderInfo from '~components/order/OrderInfo';
import ProfitColor from '~components/price/ProfitColor';
import Table from '~ui/core/Table';

interface Props {
  order: Order;
  showAllCols?: boolean;
}

function ItemHistory({ order, showAllCols }: Props) {
  const profitGross = order.grossProfit || 0;
  const fee = (order.commissionClose || 0) + (order.commission || 0) + (order.swap || 0);
  const profit = profitGross + fee;
  const profitRatio = order.balance ? (100 * profit) / order.balance : 0;
  const profitIcon = getProfitIcon(profitRatio);

  const renderProfitGross = () => (
    <ProfitColor profit={profitGross}>{_.round(profitGross, 2)}</ProfitColor>
  );

  const renderFee = () => <span>{_.round(fee, 2)}</span>;

  const renderProfit = () => (
    <ProfitColor profit={profit}>{_.round(profit, 2)}</ProfitColor>
  );

  const renderBalance = () => (
    <>
      {`${_.round(order.balance || 0, 2)} `}
      <ProfitColor profit={profitRatio}>{`(${_.round(profitRatio, 2)}% ${profitIcon})`}</ProfitColor>
    </>
  );

  return (
    <Table.Row key={order._id}>
      <Table.Cell><OrderInfo order={order} /></Table.Cell>
      <Table.Cell><OrderActivities order={order} /></Table.Cell>
      {showAllCols && (
        <>
          <Table.Cell>{renderProfitGross()}</Table.Cell>
          <Table.Cell>{renderFee()}</Table.Cell>
        </>
      )}
      <Table.Cell>{renderProfit()}</Table.Cell>
      <Table.Cell>{renderBalance()}</Table.Cell>
    </Table.Row>
  );
}

export default ItemHistory;
