import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, AlertCircle, Clock, BarChart2, Info, Maximize2 } from 'lucide-react';
import { ComparisonBarChart } from '../../components/charts/ComparisonBarChart';
import { DistributionPieChart } from '../../components/charts/DistributionPieChart';
import { TrendLineChart } from '../../components/charts/TrendLineChart';
import { ChartExpandModal } from '../../components/charts/ChartExpandModal';
import {
  districtStats,
  monthlyTrend,
  getDensityColor,
  type DistrictStat,
} from '../../data/districtStats';

const MAP_CENTER: [number, number] = [25.05, 121.55];
const MAP_ZOOM = 11;

type FilterType = 'all' | 'general' | 'bee';

// ── KPI 卡片 ─────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}
const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, icon, color }) => (
  <div className={`rounded-2xl p-4 border ${color} flex items-start gap-3`}>
    <div className="mt-0.5 opacity-80">{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
      {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── 密度色階圖例 ─────────────────────────────────────────────────
const DensityLegend: React.FC = () => (
  <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-slate-200 shadow-md">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">案件密度</p>
    {[
      { label: '> 200', color: '#ef4444' },
      { label: '101–200', color: '#f97316' },
      { label: '51–100', color: '#f59e0b' },
      { label: '21–50', color: '#22c55e' },
      { label: '≤ 20', color: '#3b82f6' },
    ].map(({ label, color }) => (
      <div key={label} className="flex items-center gap-2 mb-1">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-medium text-slate-600">{label} 件</span>
      </div>
    ))}
  </div>
);

// ── 主元件 ───────────────────────────────────────────────────────
export const GisAnalytics: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictStat | null>(null);
  const [expandedChart, setExpandedChart] = useState<'bar' | 'pie' | 'trend' | null>(null);

  // 根據篩選計算各區數值
  const filteredStats = useMemo<DistrictStat[]>(() => {
    if (filterType === 'all') return districtStats;
    return districtStats.map((d) => ({
      ...d,
      total: filterType === 'general' ? d.general : d.bee,
      pending: Math.round((filterType === 'general' ? d.general : d.bee) * 0.13),
      processing: Math.round((filterType === 'general' ? d.general : d.bee) * 0.18),
      resolved: Math.round((filterType === 'general' ? d.general : d.bee) * 0.69),
    }));
  }, [filterType]);

  // KPI 聚合
  const totalCases = filteredStats.reduce((s, d) => s + d.total, 0);
  const totalPending = filteredStats.reduce((s, d) => s + d.pending, 0);
  const avgResponse = Math.round(
    filteredStats.reduce((s, d) => s + d.avgResponseMin, 0) / filteredStats.length
  );
  const activeDistricts = filteredStats.filter((d) => d.total > 0).length;

  // 長條圖：Top 10 行政區
  const barData = useMemo(() =>
    [...filteredStats]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((d) => ({ name: d.name.replace('區', ''), 一般: d.general, 蜂案: d.bee })),
    [filteredStats]
  );

  // 圓餅圖：案件類型
  const pieData = useMemo(() => {
    const totalGeneral = filteredStats.reduce((s, d) => s + d.general, 0);
    const totalBee = filteredStats.reduce((s, d) => s + d.bee, 0);
    return [
      { name: '一般救援', value: totalGeneral, color: '#ef4444' },
      { name: '蜂案', value: totalBee, color: '#f97316' },
    ];
  }, [filteredStats]);

  // 趨勢折線圖：近 12 個月
  const trendData = useMemo(() => {
    if (filterType === 'all') return monthlyTrend;
    return monthlyTrend.map((m) => ({ date: m.date, [filterType]: m[filterType] }));
  }, [filterType]);

  const trendLines = useMemo(() => {
    if (filterType === 'general') return [{ dataKey: 'general', name: '一般救援', color: '#ef4444' }];
    if (filterType === 'bee') return [{ dataKey: 'bee', name: '蜂案', color: '#f97316' }];
    return [
      { dataKey: 'total', name: '總計', color: '#2563EB', strokeWidth: 3 },
      { dataKey: 'general', name: '一般救援', color: '#ef4444' },
      { dataKey: 'bee', name: '蜂案', color: '#f97316' },
    ];
  }, [filterType]);

  // 展開圖表 Modal 設定
  const expandConfig = useMemo(() => {
    if (!expandedChart) return null;

    if (expandedChart === 'bar') {
      const cols = ['行政區', '一般救援', '蜂案', '合計', '佔比'];
      const rows = barData.map((d) => {
        const total = d['一般'] + d['蜂案'];
        return [
          d.name,
          d['一般'].toLocaleString(),
          d['蜂案'].toLocaleString(),
          total.toLocaleString(),
          `${((total / totalCases) * 100).toFixed(1)}%`,
        ];
      });
      return {
        title: '行政區案件 Top 10',
        subtitle: '依總案件數排序',
        chartNode: (
          <ComparisonBarChart
            data={barData}
            series={[
              { dataKey: '一般', name: '一般救援', color: '#ef4444' },
              { dataKey: '蜂案', name: '蜂案', color: '#f97316' },
            ]}
            height={500}
            xAxisKey="name"
          />
        ),
        columns: cols,
        rows,
      };
    }

    if (expandedChart === 'pie') {
      const cols = ['案件類型', '數量', '佔比'];
      const rows = pieData.map((d) => [
        d.name,
        d.value.toLocaleString(),
        `${((d.value / totalCases) * 100).toFixed(1)}%`,
      ]);
      return {
        title: '案件類型分佈',
        subtitle: '一般救援 vs 蜂案',
        chartNode: (
          <DistributionPieChart
            data={pieData}
            height={500}
            showLabel
          />
        ),
        columns: cols,
        rows,
      };
    }

    // trend
    const cols = ['月份', '一般救援', '蜂案', '合計'];
    const rows = monthlyTrend.map((m) => [
      m.date,
      m.general.toLocaleString(),
      m.bee.toLocaleString(),
      m.total.toLocaleString(),
    ]);
    return {
      title: '近 12 個月趨勢',
      subtitle: '月份案件數量變化',
      chartNode: (
        <TrendLineChart
          data={trendData}
          lines={trendLines}
          height={500}
        />
      ),
      columns: cols,
      rows,
    };
  }, [expandedChart, barData, pieData, trendData, trendLines, totalCases]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 標題列 */}
      <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Map size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">GIS 圖資數據中心</h1>
            <p className="text-xs text-slate-400 font-medium">新北市動保案件行政區分析</p>
          </div>
        </div>

        {/* 篩選器 */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
          {(['all', 'general', 'bee'] as FilterType[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === t
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'all' ? '全部案件' : t === 'general' ? '一般救援' : '蜂案'}
            </button>
          ))}
        </div>
      </div>

      {/* 主體：雙欄 */}
      <div className="grid grid-cols-[1fr_400px] gap-0 h-[calc(100vh-73px)]">

        {/* 左側：地圖 */}
        <div className="relative">
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredStats.map((district) => {
              const radius = Math.max(Math.sqrt(district.total) * 700, 1500);
              const color = getDensityColor(district.total);
              const isSelected = selectedDistrict?.id === district.id;

              return (
                <CircleMarker
                  key={district.id}
                  center={district.center}
                  radius={Math.max(Math.sqrt(district.total) * 2.5, 8)}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: isSelected ? 0.85 : 0.6,
                    color: isSelected ? '#1e3a8a' : color,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => setSelectedDistrict(district),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                    <div className="text-xs font-bold">
                      {district.name}：{district.total} 件
                    </div>
                  </Tooltip>
                  <Popup>
                    <div className="min-w-[180px] p-1">
                      <div className="font-black text-slate-900 text-base mb-2">{district.name}</div>
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>總案件</span>
                          <span className="font-bold text-slate-900">{district.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>待處理</span>
                          <span className="font-bold text-red-500">{district.pending}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>處理中</span>
                          <span className="font-bold text-blue-500">{district.processing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>已結案</span>
                          <span className="font-bold text-green-600">{district.resolved}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-1 mt-1">
                          <span>平均時效</span>
                          <span className="font-bold">{district.avgResponseMin} 分</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          <DensityLegend />

          {/* 選中行政區 badge */}
          {selectedDistrict && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
              <Info size={12} />
              已選取：{selectedDistrict.name}（{selectedDistrict.total} 件）
              <button
                onClick={() => setSelectedDistrict(null)}
                className="ml-1 opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* 右側：數據面板 */}
        <div className="bg-white border-l border-slate-100 overflow-y-auto flex flex-col gap-5 p-5">

          {/* KPI 卡片 */}
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              label="總案件數"
              value={totalCases.toLocaleString()}
              sub={selectedDistrict ? `選取：${selectedDistrict.name}` : '全市合計'}
              icon={<BarChart2 size={20} className="text-blue-500" />}
              color="bg-blue-50 border-blue-100"
            />
            <KpiCard
              label="活躍行政區"
              value={activeDistricts}
              sub={`共 ${districtStats.length} 個行政區`}
              icon={<Map size={20} className="text-emerald-500" />}
              color="bg-emerald-50 border-emerald-100"
            />
            <KpiCard
              label="待處理案件"
              value={totalPending}
              sub="需要立即處理"
              icon={<AlertCircle size={20} className="text-red-500" />}
              color="bg-red-50 border-red-100"
            />
            <KpiCard
              label="平均時效"
              value={`${avgResponse} 分`}
              sub="全市平均處理時間"
              icon={<Clock size={20} className="text-orange-500" />}
              color="bg-orange-50 border-orange-100"
            />
          </div>

          {/* 行政區長條圖 Top 10 */}
          <div className="relative group">
            <button
              onClick={() => setExpandedChart('bar')}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-lg bg-slate-100 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
              title="放大圖表"
            >
              <Maximize2 size={13} />
            </button>
            <ComparisonBarChart
              data={barData}
              series={[
                { dataKey: '一般', name: '一般救援', color: '#ef4444' },
                { dataKey: '蜂案', name: '蜂案', color: '#f97316' },
              ]}
              title="行政區案件 Top 10"
              subtitle="依總案件數排序"
              height={220}
              xAxisKey="name"
            />
          </div>

          {/* 案件類型圓餅圖 */}
          <div className="relative group">
            <button
              onClick={() => setExpandedChart('pie')}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-lg bg-slate-100 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
              title="放大圖表"
            >
              <Maximize2 size={13} />
            </button>
            <DistributionPieChart
              data={pieData}
              title="案件類型分佈"
              subtitle="一般救援 vs 蜂案"
              height={200}
              showLabel={false}
            />
          </div>

          {/* 12 個月趨勢 */}
          <div className="relative group">
            <button
              onClick={() => setExpandedChart('trend')}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-lg bg-slate-100 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
              title="放大圖表"
            >
              <Maximize2 size={13} />
            </button>
            <TrendLineChart
              data={trendData}
              lines={trendLines}
              title="近 12 個月趨勢"
              subtitle="月份案件數量變化"
              height={220}
            />
          </div>
        </div>
      </div>

      {/* 圖表放大 Modal */}
      {expandConfig && (
        <ChartExpandModal
          isOpen={expandedChart !== null}
          onClose={() => setExpandedChart(null)}
          title={expandConfig.title}
          subtitle={expandConfig.subtitle}
          chartNode={expandConfig.chartNode}
          columns={expandConfig.columns}
          rows={expandConfig.rows}
        />
      )}
    </div>
  );
};
