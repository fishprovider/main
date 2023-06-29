import storeAccounts from '@fishbot/cross/stores/accounts';
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

const defaultProfitMonths: Record<number, number[]> = {
  2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.07],
  2023: [3.16, 1.8, 3.15, 2.14, 2.1, 4.18],
};

const nameProfit = 'Profit (%)';
const nameProfitAcc = 'Profit Acc. (%)';

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

      const profit = profitMonths[+year]?.[idx] || 0;
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" unit="%" />
        <YAxis yAxisId="right" unit="%" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey={nameProfit}
          shape={BarProfit}
        />
        <Line
          yAxisId="right"
          dataKey={nameProfitAcc}
          stroke="orange"
          strokeWidth={3}
        />
        <Brush
          dataKey="month"
          startIndex={Math.max(0, data.length - 12)}
          endIndex={Math.max(0, data.length - 1)}
          travellerWidth={12}
          stroke="blue"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default MonthProfit;
