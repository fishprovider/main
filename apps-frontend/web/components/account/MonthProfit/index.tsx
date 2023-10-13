import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import _ from 'lodash';
import moment from 'moment';
import {
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import useTablet from '~ui/styles/useTablet';

const defaultProfitMonths: Record<number, number[]> = {
  2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.07],
  2023: [3.16, 1.8, 3.15, 2.14, 2.1, 4.18, 2.22, 2.05, 2.06, 2.09],
};

const nameProfit = 'Monthly Profit (%)';
const nameProfitAcc = 'Total Profit (%)';

function BarProfit(props: { value: number }) {
  const { value } = props;
  return (
    <Rectangle
      {...props}
      fill={
        value >= 0 ? 'green' : 'red'
      }
    />
  );
}

interface Props {
  providerId: string;
  height?: number;
}

function MonthProfit({
  providerId,
  height = 300,
}: Props) {
  const isTablet = useTablet();

  const {
    profitMonths = defaultProfitMonths,
  } = storeAccounts.useStore((state) => ({
    profitMonths: state[providerId]?.stats?.profitMonths,
  }));

  const data: {
    month: string;
    [nameProfit]: number;
    [nameProfitAcc]: number;
  }[] = [];

  const currentYear = moment().year();
  const currentMonth = moment().month();

  _.keys(profitMonths).forEach((year) => {
    _.range(0, 12).forEach((idx) => {
      if (+year === currentYear && idx > currentMonth) return;

      const profit = +(profitMonths[+year]?.[idx] || 0);
      if (+year === currentYear && idx === currentMonth && !profit) return;

      const month = `${year}/${idx + 1}`;
      const lastAcc = data[data.length - 1]?.[nameProfitAcc] || 0;
      data.push({
        month,
        [nameProfit]: profit,
        [nameProfitAcc]: _.round(lastAcc + profit, 2),
      });
    });
  });

  // const renderLabel = ({
  //   x, y, width, value,
  // }: any) => (
  //   <g>
  //     <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={isTablet ? 10 : 14}>
  //       {`${value}%`}
  //     </text>
  //   </g>
  // );

  const travellerWidth = isTablet ? 6 : 12;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis yAxisId="profitMonth" unit="%" stroke="green" orientation="right" />
        <YAxis yAxisId="profitAcc" unit="%" stroke="orange" />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="profitMonth"
          dataKey={nameProfit}
          shape={BarProfit}
          // label={{ content: renderLabel }}
        />
        <Line
          yAxisId="profitAcc"
          dataKey={nameProfitAcc}
          stroke="orange"
          strokeWidth={3}
        />
        <Brush
          dataKey="month"
          startIndex={Math.max(0, data.length - travellerWidth)}
          endIndex={Math.max(0, data.length - 1)}
          travellerWidth={travellerWidth}
          stroke="blue"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default MonthProfit;
