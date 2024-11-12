import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { useLeadStore } from '@/store/leadStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeadStats {
  status: string;
  count: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-background border border-border p-2 shadow-md rounded-md">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm">Count: {payload[0].value}</p>
    </div>
  );
};

const CustomBar = (props: any) => (
  <Bar
    {...props}
    dataKey="count"
    fill="hsl(var(--primary))"
    radius={[4, 4, 0, 0]}
    maxBarSize={50}
  />
);

const CustomXAxis = (props: any) => (
  <XAxis
    {...props}
    dataKey="status"
    tick={{ fontSize: '12px', fill: 'currentColor' }}
    tickLine={{ stroke: 'currentColor' }}
    axisLine={{ stroke: 'currentColor' }}
  />
);

const CustomYAxis = (props: any) => (
  <YAxis
    {...props}
    allowDecimals={false}
    tick={{ fontSize: '12px', fill: 'currentColor' }}
    tickLine={{ stroke: 'currentColor' }}
    axisLine={{ stroke: 'currentColor' }}
  />
);

export default function LeadVisualization() {
  const leads = useLeadStore((state) => state.leads);

  const data: LeadStats[] = React.useMemo(() => {
    const stats = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([status, count]) => ({
      status,
      count,
    }));
  }, [leads]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Lead Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <CustomXAxis />
                <CustomYAxis />
                <Tooltip content={CustomTooltip} />
                <CustomBar />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}