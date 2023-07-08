import storeSignals from '@fishprovider/cross/stores/signals';
import { Direction } from '@fishprovider/utils/constants/order';
import type { Signal } from '@fishprovider/utils/types/Signal.model';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import BuySellIcon from '~components/order/BuySellIcon';
import type { signalVersions } from '~constants/order';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import Text from '~ui/core/Text';
import Tooltip from '~ui/core/Tooltip';

const NUM_LAST_SIGNALS = 6;

const TimeFrameText: Record<string, string> = {
  Hour: 'H1',
  Hour4: 'H4',
  Daily: 'D1',
  Weekly: 'W1',
};

const getScoreMsg = (score: number) => {
  if (score >= 6) return 'Strong Buy';
  if (score >= 3) return 'Buy';
  if (score >= 1) return 'Weak Buy';
  if (score === 0) return 'Neutral';
  if (score >= -2) return 'Weak Sell';
  if (score >= -5) return 'Sell';
  return 'Strong Sell';
};

const transformScoreSignal = (signal: Signal, note: string) => {
  const [, scoreRaw = 0, srTop, srBottom] = signal.pattern.split('_');

  const score = +scoreRaw;
  let scoreColor = '';
  if (score > 0) scoreColor = 'green';
  else if (score < 0) scoreColor = 'red';

  let closeTime;
  if (signal.timeFr === 'Weekly') { closeTime = moment(signal.openTime).add(1, 'week'); } else if (signal.timeFr === 'Daily') { closeTime = moment(signal.openTime).add(1, 'day'); } else if (signal.timeFr === 'Hour4') { closeTime = moment(signal.openTime).add(4, 'hours'); } else if (signal.timeFr === 'Hour') { closeTime = moment(signal.openTime).add(1, 'hour'); }

  return {
    ...signal,
    score,
    scoreMsg: getScoreMsg(score),
    scoreColor,
    srTop,
    srBottom,
    note,
    closeTime,
  };
};

type SignalExt = ReturnType<typeof transformScoreSignal>;

const getScoreSignals = (signals: Signal[], checkTimeFr: string, note: string) => {
  const timeFrSignals = _.orderBy(
    _.filter(signals, ({ timeFr }) => timeFr === checkTimeFr),
    ({ openTime }) => moment(openTime),
    'desc',
  );
  return _.take(timeFrSignals, NUM_LAST_SIGNALS)
    .map((signal) => transformScoreSignal(signal, note));
};

const getTooltipMsg = ({ srTop, srBottom }: SignalExt) => `Between ${srTop} and ${srBottom}`;

interface Props {
  symbol: string;
  signalVersion: typeof signalVersions[number];
}

function SignalSymbol({ symbol, signalVersion }: Props) {
  const signals = storeSignals.useStore((state) => _.filter(
    state,
    ({ symbolName, pattern }) => symbolName === symbol
      && pattern.startsWith(signalVersion.patternPrefix),
  ));

  const renderRow = (signal: SignalExt, index: number, rows: Signal[]) => (
    <Table.Row key={signal._id}>
      {index === 0 && (
        <Table.Cell
          style={{ fontWeight: 'bold', fontSize: 'large' }}
          rowSpan={rows.length}
        >
          {TimeFrameText[signal.timeFr]}
        </Table.Cell>
      )}
      <Table.Cell
        style={{ fontWeight: index === 0 ? 'bold' : 'unset' }}
      >
        {index === 0 && <Text color={signal.scoreColor}>{signal.note}</Text>}
        {moment(signal.closeTime).format('dd MMM DD ha')}
      </Table.Cell>
      <Table.Cell
        style={{
          fontWeight: index === 0 ? 'bold' : 'unset',
          fontSize: index === 0 ? 'large' : 'unset',
          color: signal.scoreColor,
        }}
      >
        <Group>
          {signal.score === 0 ? (
            <Icon name="CircleOutlinedIcon" />
          ) : (
            <BuySellIcon direction={_.lowerCase(signal.direction) === 'buy' ? Direction.buy : Direction.sell} />
          )}
          &nbsp;
          {signal.scoreMsg}
        </Group>
      </Table.Cell>
      <Table.Cell
        style={{
          fontWeight: index === 0 ? 'bold' : 'unset',
          fontSize: index === 0 ? 'large' : 'unset',
        }}
      >
        {_.round(Math.abs(signal.score), 2)}
      </Table.Cell>
      <Table.Cell
        style={{
          fontWeight: index === 0 ? 'bold' : 'unset',
          fontSize: index === 0 ? 'large' : 'unset',
        }}
      >
        <Tooltip label={getTooltipMsg(signal)}>{signal.currentPrice}</Tooltip>
      </Table.Cell>
    </Table.Row>
  );

  const h1Signals = getScoreSignals(signals, 'Hour', 'NOW');
  const h4Signals = getScoreSignals(signals, 'Hour4', 'RECENTLY');
  const d1Signals = getScoreSignals(signals, 'Daily', 'TODAY');
  const w1Signals = getScoreSignals(signals, 'Weekly', 'THIS WEEK');

  return (
    <Table verticalSpacing={0}>
      <Table.THead>
        <Table.Row>
          <Table.Header>Time Frame</Table.Header>
          <Table.Header>{`Close Time (UTC ${moment().format('Z').substring(0, 3)})`}</Table.Header>
          <Table.Header>Direction</Table.Header>
          <Table.Header>Level</Table.Header>
          <Table.Header>Price</Table.Header>
        </Table.Row>
      </Table.THead>
      <Table.TBody>
        {h1Signals.map(renderRow)}
        {h4Signals.map(renderRow)}
        {d1Signals.map(renderRow)}
        {w1Signals.map(renderRow)}
      </Table.TBody>
    </Table>
  );
}

export default SignalSymbol;
