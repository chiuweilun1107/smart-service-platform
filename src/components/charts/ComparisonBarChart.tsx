import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface BarSeriesConfig {
  dataKey: string;
  name: string;
  color: string;
}

interface ComparisonBarChartProps {
  data: any[];
  series?: BarSeriesConfig[];
  barKeys?: string[];
  barColors?: string[];
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

export function ComparisonBarChart({
  data,
  series,
  barKeys = ['cases'],
  barColors = ['#3b82f6'],
  title,
  subtitle,
  height = 300,
  xAxisKey = 'name'
}: ComparisonBarChartProps) {
  const configs = series || barKeys.map((key, index) => ({
    dataKey: key,
    name: key,
    color: barColors[index] || barColors[0]
  }));

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
          {configs.length > 1 && <Legend wrapperStyle={{ paddingTop: '20px' }} />}

          {configs.map((config, index) => (
            <Bar
              key={index}
              dataKey={config.dataKey}
              name={config.name}
              fill={config.color}
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
