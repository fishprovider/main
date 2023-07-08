import type { ProviderType } from '@fishprovider/utils/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/constants/order';
import { getEntry, getProfit } from '@fishprovider/utils/helpers/order';
import { getDiffPips, getLotFromVolume } from '@fishprovider/utils/helpers/price';
import type { Order } from '@fishprovider/utils/types/Order.model';
import type { Price } from '@fishprovider/utils/types/Price.model';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import _ from 'lodash';
import { PureComponent, useRef, useState } from 'react';

import useToggle from '~hooks/useToggle';
import {
  BarSeries,
  bollingerBand,
  BollingerBandTooltip,
  BollingerSeries,
  CandlestickSeries,
  change,
  Chart,
  ChartCanvas,
  CrossHairCursor,
  CurrentCoordinate,
  discontinuousTimeScaleProviderBuilder,
  EdgeIndicator,
  ema,
  InteractiveYCoordinate,
  lastVisibleItemBasedZoomAnchor,
  LineSeries,
  MouseCoordinateX,
  MouseCoordinateY,
  MovingAverageTooltip,
  OHLCTooltip,
  PriceCoordinate,
  rsi,
  RSISeries,
  RSITooltip,
  SingleValueTooltip,
  ToolTipText,
  VolumeProfileSeries,
  withDeviceRatio,
  withSize,
  XAxis,
  YAxis,
  ZoomButtons,
} from '~libs/chart';
import Menu from '~ui/core/Menu';
import Text from '~ui/core/Text';
import { toastInfo } from '~ui/toast';

interface Props {
  data: any[];
  srTimeFrs: {
    keyLevels: number[],
    timeFr: string,
  }[],
  asset: string,
  providerType: ProviderType,
  priceDoc: Price,
  prices: Record<string, Price>,
  rate: number,
  orders: Order[],
  onAddOrder: () => void,
  onRemoveOrder: (orderId: string) => void,
  onUpdateOrder: (orderId: string, options: {
    stopLoss?: number,
    takeProfit?: number,
    limitPrice?: number,
    stopPrice?: number,
  }) => void;
  onLoadMore?: (start: number, end: number) => void;
  readonly ratio: number,
  readonly height: number,
  readonly width: number,
}

const margin = {
  left: 0,
  right: 60,
  top: 0,
  bottom: 20,
};

const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => d.date);

const pricesDisplayFormat = (priceDoc: Price) => format(`.${priceDoc.digits || 0}f`);
const timeDisplayFormat = timeFormat('%d %b %y %H:%M:%S %Z');

const volumeChartYExtents = (data: any) => data.volume;
const volumeSeries = (data: any) => data.volume;
const volumeColor = (data: any) => (data.close > data.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)');

const candleChartExtents = (data: any) => [
  data.high + (data.high + data.low) * 0.01,
  data.low - (data.high + data.low) * 0.01,
];

const yEdgeIndicator = (data: any) => data.close;

const openCloseColor = (data: any) => (data.close > data.open ? '#26a69a' : '#ef5350');

const orderStyle = (
  text: string,
  color: string,
  left: number,
  canDrag?: boolean,
  disableClose?: boolean,
) => ({
  ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
  stroke: color,
  textFill: color,
  text,
  edge: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
    stroke: color,
  },
  textBox: {
    ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.textBox,
    left,
    ...(disableClose && {
      closeIcon: {
        padding: { left: 0, right: 0 },
        width: 0,
      },
    }),
  },
  draggable: !!canDrag,
});

const ema20 = ema()
  .id(1)
  .options({ windowSize: 20 })
  .merge((d: any, c: any) => {
    // eslint-disable-next-line no-param-reassign
    d.ema20 = c;
  })
  .accessor((d: any) => d.ema20);

const ema50 = ema()
  .id(2)
  .options({ windowSize: 50 })
  .merge((d: any, c: any) => {
    // eslint-disable-next-line no-param-reassign
    d.ema50 = c;
  })
  .accessor((d: any) => d.ema50);

const rsi14 = rsi()
  .options({ windowSize: 14 })
  .merge((d: any, c: any) => {
    // eslint-disable-next-line no-param-reassign
    d.rsi = c;
  })
  .accessor((d: any) => d.rsi);

const bb = bollingerBand()
  .merge((d: any, c: any) => {
    // eslint-disable-next-line no-param-reassign
    d.bb = c;
  })
  .accessor((d: any) => d.bb);

function FinChart({
  data: initialData,
  srTimeFrs,
  asset,
  providerType,
  priceDoc,
  prices,
  rate,
  orders,
  onAddOrder,
  onRemoveOrder,
  onUpdateOrder,
  onLoadMore,
  ratio,
  height,
  width,
}: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number, mouseY: number
  } | null>(null);

  const [showEma20, toggleShowEma20] = useToggle(true);
  const [showEma50, toggleShowEma50] = useToggle(true);
  const [showVolume, toggleShowVolume] = useToggle(true);
  const [showVolumeProfile, toggleShowVolumeProfile] = useToggle();
  const [showRsi14, toggleShowRsi14] = useToggle();
  const [showBB, toggleShowBB] = useToggle();

  const {
    data, xScale, xAccessor, displayXAccessor,
  } = xScaleProvider(
    bb(rsi14(ema50(ema20(change()(initialData))))),
  );

  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;
  const rsiChartHeight = showRsi14 ? 100 : 0;
  const chartHeight = gridHeight - rsiChartHeight;
  const volumeChartHeight = chartHeight / 4;

  const rsiOrigin = (_x: number, y: number) => [0, y - rsiChartHeight];
  const volumeChartOrigin = (_widthChart: number, heightChart: number) => [
    0,
    heightChart - volumeChartHeight - rsiChartHeight,
  ];

  const yCoordinateList = _.flatMap(orders, (order, index) => {
    const {
      _id: orderId, direction, volume, status,
    } = order;
    const isPending: boolean = status === OrderStatus.pending;
    const entry = getEntry(order) || 0;
    const getLabel = () => {
      switch (order.orderType) {
        case OrderType.limit: return 'L';
        case OrderType.stop: return 'S';
        default: return '';
      }
    };
    const label = getLabel();
    const lot = getLotFromVolume({
      providerType,
      symbol: order.symbol,
      prices,
      volume,
    }).lot || 0;
    const pips = Math.abs(getDiffPips({
      providerType,
      symbol: order.symbol,
      prices,
      entry: priceDoc.last,
      price: entry,
    }).pips || 0);
    const profit = getProfit([order], prices, asset);

    const diffText = isPending ? `${_.round(pips, 2)} pips` : `${_.round(profit, 2)} ${asset}`;

    const lines = [
      {
        ...orderStyle(
          `${_.upperFirst(direction)} ${lot} (${diffText}) [${label}${index + 1}]`,
          direction === Direction.buy ? '#1F9D55' : '#E3342F',
          60,
          isPending,
        ),
        yValue: entry,
        id: isPending ? `${orderId}_${label}` : orderId,
      },
    ];
    if (order.stopLoss) {
      const stopLossAmt = _.round(
        (Math.abs(order.stopLoss - entry) * volume) / rate,
        2,
      );
      lines.push({
        ...orderStyle(
          `SL ${stopLossAmt} ${asset} [${label}${index + 1}]`,
          'rgba(239, 83, 80, 0.7)',
          100,
          true,
          true,
        ),
        yValue: order.stopLoss,
        id: `${orderId}_SL`,
      });
    }
    if (order.takeProfit) {
      const takeProfitAmt = _.round(
        (Math.abs(order.takeProfit - entry) * volume) / rate,
        2,
      );
      lines.push({
        ...orderStyle(
          `TP ${takeProfitAmt} ${asset} [${label}${index + 1}]`,
          'rgba(38, 166, 154, 0.7)',
          100,
          true,
          true,
        ),
        yValue: order.takeProfit,
        id: `${orderId}_TP`,
      });
    }
    return lines;
  });

  const onNewOrder = () => {
    setContextMenu(null);
    onAddOrder();
  };

  const onEditIndicators = () => {
    setContextMenu(null);
    toastInfo('Coming soon');
  };

  return (
    <>
      <div
        ref={chartRef}
        style={{
          position: 'relative',
          top: contextMenu?.mouseY,
          left: contextMenu?.mouseX,
        }}
      >
        <Menu
          opened={contextMenu !== null}
          onClose={() => setContextMenu(null)}
          items={[
            { key: 'newOrder', content: <Text>New Order</Text>, onClick: onNewOrder },
            { key: 'indicators', content: <Text>Indicators</Text>, onClick: onEditIndicators },
          ]}
        >
          <div />
        </Menu>
      </div>
      <ChartCanvas
        margin={margin}
        height={height}
        width={width}
        ratio={ratio}
        seriesName="Data"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor} // getBarIndex
        displayXAccessor={displayXAccessor}
        xExtents={xExtents} // number of default bars on first view
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
        onLoadBefore={onLoadMore}
      >
        <Chart
          id={1}
          height={volumeChartHeight}
          origin={volumeChartOrigin}
          yExtents={volumeChartYExtents}
        >
          {showVolume && <BarSeries yAccessor={volumeSeries} fillStyle={volumeColor} />}
        </Chart>
        <Chart
          id={2}
          height={chartHeight}
          yExtents={candleChartExtents}
          onContextMenu={(_event: React.MouseEvent, moreProps: any) => {
            setContextMenu((prev) => {
              if (prev) return null;
              return {
                mouseX: moreProps.mouseXY[0],
                mouseY: moreProps.mouseXY[1],
              };
            });
          }}
        >
          <XAxis showTicks={false} showTickLabel={false} />
          <YAxis tickFormat={pricesDisplayFormat(priceDoc)} />

          <CandlestickSeries />
          {showVolumeProfile && <VolumeProfileSeries orient="right" />}
          {showEma20 && <LineSeries yAccessor={ema20.accessor()} strokeStyle="blue" />}
          <CurrentCoordinate yAccessor={ema20.accessor()} fillStyle="blue" />
          {showEma50 && <LineSeries yAccessor={ema50.accessor()} strokeStyle="red" />}
          <CurrentCoordinate yAccessor={ema50.accessor()} fillStyle="red" />
          {showBB && <BollingerSeries />}

          <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={openCloseColor}
            lineStroke={openCloseColor}
            displayFormat={pricesDisplayFormat(priceDoc)}
            yAccessor={yEdgeIndicator}
          />
          <OHLCTooltip origin={[8, 16]} />
          <MovingAverageTooltip
            origin={[8, 24]}
            options={[
              {
                yAccessor: ema20.accessor(),
                type: 'EMA',
                stroke: showEma20 ? 'blue' : 'lightblue',
                windowSize: ema20.options().windowSize,
              },
            ]}
            onClick={() => toggleShowEma20()}
          />
          <MovingAverageTooltip
            origin={[75, 24]}
            options={[
              {
                yAccessor: ema50.accessor(),
                type: 'EMA',
                stroke: showEma50 ? 'red' : 'lightpink',
                windowSize: ema50.options().windowSize,
              },
            ]}
            onClick={() => toggleShowEma50()}
          />
          <SingleValueTooltip
            origin={[140, 35]}
            yLabel="Volume"
            yAccessor={volumeChartYExtents}
            onClick={() => toggleShowVolume()}
          />
          <ToolTipText
            x={140}
            y={50}
            onClick={() => toggleShowVolumeProfile()}
          >
            Volume Profile
          </ToolTipText>
          <BollingerBandTooltip
            origin={[250, 35]}
            yAccessor={bb.accessor()}
            options={bb.options()}
            onClick={() => toggleShowBB()}
            labelFill={showBB ? 'black' : 'grey'}
          />
          <RSITooltip
            origin={[250, 50]}
            yAccessor={rsi14.accessor()}
            options={rsi14.options()}
            onClick={() => toggleShowRsi14()}
            labelFill={showRsi14 ? 'black' : 'grey'}
          />

          <ZoomButtons />
          <MouseCoordinateY
            rectWidth={margin.right}
            displayFormat={pricesDisplayFormat(priceDoc)}
          />
          <MouseCoordinateX displayFormat={timeDisplayFormat} />

          {srTimeFrs?.map(({ keyLevels, timeFr }) => {
            const color = timeFr === 'Daily' ? 'red' : 'orange';
            return keyLevels?.map((keyLevel, index) => (
              <PriceCoordinate
                key={`${timeFr}_${keyLevel}_${index}`}
                orient="right"
                price={keyLevel}
                lineStroke={color}
                strokeDasharray="ShortDash"
              />
            ));
          })}

          <InteractiveYCoordinate
            yCoordinateList={yCoordinateList}
            onDelete={(_e: React.MouseEvent, yCoordinate: any) => {
              const orderId = yCoordinate.id.split('_')[0] as string;
              onRemoveOrder(orderId);
            }}
            onDragComplete={(
              _e: React.MouseEvent,
              _newAlertList: any[],
              _moreProps: any,
              draggedAlert: any,
            ) => {
              const { id, yValue: newPrice } = draggedAlert;
              const [orderId, label] = id.split('_');
              onUpdateOrder(orderId, {
                ...(label === 'SL' && { stopLoss: +newPrice }),
                ...(label === 'TP' && { takeProfit: +newPrice }),
                ...(label === 'L' && { limitPrice: +newPrice }),
                ...(label === 'S' && { stopPrice: +newPrice }),
              });
            }}
            onChoosePosition={() => undefined}
            enabled
          />
        </Chart>
        {showRsi14 && (
          <Chart
            id={3}
            height={rsiChartHeight}
            yExtents={[0, rsi14.accessor()]}
            origin={rsiOrigin}
            padding={{ top: 20, bottom: 0 }}
          >
            <XAxis />
            <YAxis tickValues={[30, 50, 70]} />
            <RSISeries yAccessor={rsi14.accessor()} />

            <MouseCoordinateX displayFormat={timeDisplayFormat} />
          </Chart>
        )}

        <CrossHairCursor />
      </ChartCanvas>
    </>
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class FinChartClass extends PureComponent<Props> {
  override render() {
    return <FinChart {...this.props} />;
  }
}

const FinChartWithRatio = withDeviceRatio()(FinChartClass);
const FinChartWithSize = withSize({ style: { minHeight: 600 } })(FinChartWithRatio);

export default FinChartWithSize;
