import storeUser from '@fishprovider/cross/dist/stores/user';
import { Direction, OrderType } from '@fishprovider/utils/dist/constants/order';
import _ from 'lodash';
import { useState } from 'react';

import SymbolsSelect from '~components/SymbolsSelect';
import Button from '~ui/Button';
import Group from '~ui/Group';
import Label from '~ui/Label';
import RadioGroup from '~ui/RadioGroup';
import Stack from '~ui/Stack';

export default function OpenOrderModal() {
  const {
    symbol,
  } = storeUser.useStore((state) => ({
    symbol: state.activeSymbol,
  }));

  const [orderType, setOrderType] = useState<OrderType>(OrderType.market);
  const [direction, setDirection] = useState<Direction>(Direction.buy);

  const onOpen = () => {
    Logger.info(symbol, orderType, direction);
  };

  const renderOrderType = () => (
    <RadioGroup defaultValue={OrderType.market} orientation="horizontal" space="$4">
      <Group onPress={() => setOrderType(OrderType.market)}>
        <RadioGroup.Item value={OrderType.market} size="$6" id={OrderType.market}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor={OrderType.market}>Market</Label>
      </Group>
      <Group onPress={() => setOrderType(OrderType.limit)}>
        <RadioGroup.Item value={OrderType.limit} size="$6" id={OrderType.limit}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor={OrderType.limit}>Limit</Label>
      </Group>
      <Group onPress={() => setOrderType(OrderType.stop)}>
        <RadioGroup.Item value={OrderType.stop} size="$6" id={OrderType.stop}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
        <Label htmlFor={OrderType.stop}>Stop</Label>
      </Group>
    </RadioGroup>
  );

  const renderBuySell = () => (
    <Group>
      <Button
        flex={1}
        theme={direction === Direction.buy ? 'green' : 'transparent'}
        borderColor="lightgrey"
        onPress={() => setDirection(Direction.buy)}
      >
        Buy
      </Button>
      <Button
        flex={1}
        theme={direction === Direction.sell ? 'red' : 'transparent'}
        borderColor="lightgrey"
        onPress={() => setDirection(Direction.sell)}
      >
        Sell
      </Button>
    </Group>
  );

  return (
    <Stack space="$6">
      <SymbolsSelect />
      {renderOrderType()}
      {renderBuySell()}
      <Button
        theme={direction === Direction.buy ? 'green' : 'red'}
        onPress={onOpen}
      >
        {_.upperFirst(direction)}
      </Button>
    </Stack>
  );
}
