import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface DistributionPieChartProps {
  data: PieData[];
  title?: string;
  subtitle?: string;
  height?: number;
  showLabel?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = (payload as any[]).reduce((sum, item) => sum + item.payload.value, 0);
    const percent = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xl">
        <p className="font-black text-sm text-slate-900">{data.name}</p>
        <p className="text-xs font-medium text-slate-700 mt-1">
          {data.value} ({percent}%)
        </p>
      </div>
    );
  }
  return null;
};

const renderLabel = ({ name }: any) => {
  return `${name}`;
};

export function DistributionPieChart({
  data,
  title,
  subtitle,
  height = 300,
  showLabel = true
}: DistributionPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
      {title && (
        <div className="mb-8">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data as any}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabel ? renderLabel : undefined}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* 圖例詳細信息 */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {data.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
                {item.name}
              </p>
              <p className="text-sm font-black text-slate-900">
                {item.value}
                <span className="text-xs text-slate-400 font-medium ml-1">
                  ({((item.value / total) * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
