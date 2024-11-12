import { XAxis as RechartsXAxis, YAxis as RechartsYAxis } from 'recharts';

const axisStyle = {
  fontSize: '12px',
  fill: 'currentColor',
};

const lineStyle = {
  stroke: 'currentColor',
};

export function XAxis() {
  return (
    <RechartsXAxis
      dataKey="status"
      scale="band"
      padding={{ left: 20, right: 20 }}
      tick={axisStyle}
      tickLine={lineStyle}
      axisLine={lineStyle}
      xAxisId="status"
    />
  );
}

export function YAxis() {
  return (
    <RechartsYAxis
      allowDecimals={false}
      tick={axisStyle}
      tickLine={lineStyle}
      axisLine={lineStyle}
      yAxisId="count"
    />
  );
}