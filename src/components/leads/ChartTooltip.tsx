import { TooltipProps } from 'recharts';
import { Card } from '@/components/ui/card';

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
};

export function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <Card className="bg-background border-border p-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm">
          {item.name}: {item.value}
        </p>
      ))}
    </Card>
  );
}