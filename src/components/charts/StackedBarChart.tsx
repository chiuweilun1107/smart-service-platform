import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface StackedBarConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface StackedBarChartProps {
  data: any[];
  stacks: StackedBarConfig[];
  title?: string;
  subtitle?: string;
  height?: number;
  xAxisKey?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xl">
        <p className="font-black text-sm mb-2 text-slate-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-xs font-medium text-slate-700">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function StackedBarChart({
  data,
  stacks,
  title,
  subtitle,
  height = 300,
  xAxisKey = 'week'
}: StackedBarChartProps) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
      {title && (
        <div className="mb-8">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />

          {stacks.map((stack, index) => (
            <Bar
              key={index}
              dataKey={stack.dataKey}
              name={stack.name}
              stackId="stack"
              fill={stack.color}
              radius={index === 0 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
              animationDuration={1000}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
