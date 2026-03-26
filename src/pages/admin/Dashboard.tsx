import { useEffect, useState } from 'react';
import {
  BarChart3, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Shield, TrendingUp
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { DateRangeSelector } from '../../components/DateRangeSelector';
import { TrendLineChart, ComparisonBarChart, StackedBarChart, DistributionPieChart } from '../../components/charts';
import { ChartWithAIAnalysis } from '../../components/ChartWithAIAnalysis';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<any[]>([]);
  const [priorityDistribution, setPriorityDistribution] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [assigneeStats, setAssigneeStats] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('month');
  const [viewMode, setViewMode] = useState<'realtime' | 'history'>('realtime');

  useEffect(() => {
    loadRealtimeData();
  }, []);

  useEffect(() => {
    if (viewMode === 'history') {
      loadHistoricalData();
    }
  }, [dateRange, viewMode]);

  const getDateRange = () => {
    const today = new Date('2026-01-21');
    let startDate = new Date(today);

    switch (dateRange) {
      case 'today':
        startDate = new Date(today);
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'week':
        const dayOfWeek = today.getDay();
        startDate.setDate(today.getDate() - dayOfWeek);
        break;
      case 'month':
        startDate.setDate(1);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate.setMonth(quarter * 3, 1);
        break;
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };

  const loadRealtimeData = async () => {
    setLoading(true);
    try {
      const dashStats = await mockApi.getDashboardStats();
      setStats(dashStats);
    } catch (error) {
      console.error('Failed to load realtime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const dateRangeObj = getDateRange();
      const [timeSeries, types, priorities, weekly, assignees] = await Promise.all([
        mockApi.getDashboardTimeSeries(dateRangeObj),
        mockApi.getCaseTypeDistribution(),
        mockApi.getCasePriorityDistribution(),
        mockApi.getWeeklyStats(),
        mockApi.getCasesByAssignee(),
      ]);

      setTimeSeriesData(timeSeries);
      setTypeDistribution(types);
      setPriorityDistribution(priorities);
      setWeeklyData(weekly);
      setAssigneeStats(assignees);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">初始化中...</p>
      </div>
    );
  }

  const metricCards = [
    {
      label: '總收件數',
      value: stats?.totalCases || 0,
      trend: '+12.5%',
      up: true,
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: '待處理案件',
      value: stats?.pendingCases || 0,
      trend: '-2.4%',
      up: false,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      label: '處理中',
      value: stats?.processingCases || 0,
      trend: '+5.2%',
      up: true,
      icon: Zap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: '已結案',
      value: stats?.resolvedCases || 0,
      trend: '+18.7%',
      up: true,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: '緊急事件',
      value: stats?.criticalCases || 0,
      trend: '+2',
      up: true,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">平台概覽</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">儀表板</h1>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setViewMode('realtime')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${viewMode === 'realtime'
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'text-slate-400 hover:text-slate-900'
              }`}
          >
            即時數據
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${viewMode === 'history'
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'text-slate-400 hover:text-slate-900'
              }`}
          >
            歷史數據
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/40 transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${card.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</div>
              <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{card.value}</div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-0 opacity-50"></div>
          </div>
        ))}
      </div>

      {/* 歷史數據：多維度統計分析區 */}
      {viewMode === 'history' && (
        <div className="space-y-8">
          {/* 時間範圍選擇器和標題 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">多維度統計分析</h2>
            <DateRangeSelector value={dateRange} onChange={setDateRange} isLoading={loading} />
          </div>

          {/* 趨勢分析圖表 */}
          {timeSeriesData.length > 0 && (
            <ChartWithAIAnalysis
              title="案件趨勢分析"
              analysis="過去 30 天內，總案件數呈現波動趨勢。平均每天約有 2-3 件新案件通報，其中待處理案件數在 1-2 件之間波動。已結案數量逐步增加，顯示承辦效率持續改善。最近 7 天已結案數量明顯提升，表示工作效率改善效果顯著。"
              insight="建議持續保持目前的工作效率，特別是對待處理案件的追蹤。同時注意到每週的案件量不均勻，可考慮優化分派機制以平衡工作負荷。"
            >
              <TrendLineChart
                data={timeSeriesData}
                lines={[
                  { dataKey: 'totalCases', name: '總案件數', color: '#3b82f6' },
                  { dataKey: 'resolvedCases', name: '已結案', color: '#10b981' },
                  { dataKey: 'pendingCases', name: '待處理', color: '#f59e0b' },
                ]}
                title="案件趨勢分析"
                subtitle="過去 30 天的案件數據變化趨勢"
                height={350}
              />
            </ChartWithAIAnalysis>
          )}

          {/* 對比分析區 - 左右分欄 */}
          {weeklyData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartWithAIAnalysis
                title="每週案件統計"
                analysis="最近 4 週中，第 3 週的案件量達到峰值 15 件，比第 1 週增加 88%。這可能反映出特定時期的投訴增加或季節性變化。第 4 週案件量略有下降至 13 件，仍保持在較高水平。建議加強人力資源配置以應對高峰期。"
                insight="案件數量的波動可能與特定事件或季節有關。應分析高峰期的案件類型，以便提前準備相應的資源和人力。"
              >
                <ComparisonBarChart
                  data={weeklyData}
                  series={[
                    { dataKey: 'totalCases', name: '總案件', color: '#3b82f6' }
                  ]}
                  title="每週案件統計"
                  subtitle="最近 4 週的案件數統計"
                  xAxisKey="week"
                  height={300}
                />
              </ChartWithAIAnalysis>

              {weeklyData.length > 0 && (
                <ChartWithAIAnalysis
                  title="每週狀態分布"
                  analysis="案件結案率呈逐週上升趨勢。第 1-2 週的結案率約 60-65%，第 3-4 週上升至 70-75%。這表示承辦團隊的效率在持續改善。待處理案件比例相應下降，從 35-40% 降至 25-30%。"
                  insight="結案率的提升非常積極，表明工作流程優化取得成效。應繼續維持此趨勢，並分析原因以推廣最佳實踐。"
                >
                  <StackedBarChart
                    data={weeklyData}
                    stacks={[
                      { dataKey: 'resolved', name: '已結案', color: '#10b981' },
                      { dataKey: 'pending', name: '待處理', color: '#f59e0b' },
                    ]}
                    title="每週狀態分布"
                    subtitle="案件狀態的週度分布"
                    xAxisKey="week"
                    height={300}
                  />
                </ChartWithAIAnalysis>
              )}
            </div>
          )}

          {/* 分布分析區 - 三等分 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {typeDistribution.length > 0 && (
              <ChartWithAIAnalysis
                title="案件類型分布"
                analysis="一般動物案件佔比最高，約佔 65%，說明民眾投訴最多的是流浪犬、棄養動物等一般動物問題。蜂蛇案件約佔 35%，呈現季節性特徵（冬季相對較少）。1999 通報和 1959 救援案件數量較少，各佔 5% 以下。"
                insight="應繼續加強一般動物問題的宣傳和教育，同時為蜂蛇案件高發期做好準備。考慮增加相關物資和人力儲備。"
              >
                <DistributionPieChart
                  data={typeDistribution}
                  title="案件類型分布"
                  subtitle="不同案件類型的佔比"
                  height={280}
                />
              </ChartWithAIAnalysis>
            )}

            {priorityDistribution.length > 0 && (
              <ChartWithAIAnalysis
                title="優先級分布"
                analysis="最緊急案件佔 25%，高優先級案件佔 30%，表示 55% 的案件需要快速處理。普通優先級佔 35%，低優先級佔 10%。高優先級案件的比例較高，需要確保有足夠的資源進行即時處理。"
                insight="建議建立優先級快速響應機制，確保高優先級案件在 24 小時內得到初步處理。同時監控最緊急案件，避免任何延誤。"
              >
                <DistributionPieChart
                  data={priorityDistribution}
                  title="優先級分布"
                  subtitle="不同優先級案件的佔比"
                  height={280}
                />
              </ChartWithAIAnalysis>
            )}

            {assigneeStats.length > 0 && (
              <ChartWithAIAnalysis
                title="承辦人工作量"
                analysis="工作負荷分布呈現不均勻狀態。李承辦人處理案件數最多，陳承辦人次之。建議考慮根據工作能力和效率重新分配案件，確保每位承辦人的工作量在合理範圍內。"
                insight="高工作負荷的承辦人容易疲勞並影響工作質量。建議進行工作量平衡調整或招聘額外人手，以提高整體效率和服務質量。"
              >
                <ComparisonBarChart
                  data={assigneeStats}
                  series={[
                    { dataKey: 'cases', name: '案件數', color: '#6366f1' }
                  ]}
                  title="承辦人工作量"
                  subtitle="各承辦人處理的案件數"
                  xAxisKey="name"
                  height={280}
                />
              </ChartWithAIAnalysis>
            )}
          </div>
        </div>
      )}

      {/* 即時數據：效能分析和基礎設施 (Compact Layout) */}
      {viewMode === 'realtime' && (
        <div className="space-y-6">

          {/* ROW 1: Quick Actions & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Quick Actions (Compact Grid) */}
            <div className="lg:col-span-8 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Zap size={16} /> 快速操作 (Quick Actions)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '建立新案件', sub: 'New Case', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: '案件總表', sub: 'All Cases', icon: BarChart3, color: 'text-slate-600', bg: 'bg-slate-50' },
                  { label: '人員調度', sub: 'Dispatch', icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: '系統日誌', sub: 'System Logs', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((action, i) => (
                  <button key={i} className={`p-4 rounded-2xl ${action.bg} flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform hover:shadow-lg duration-300 group`}>
                    <action.icon size={24} className={`${action.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-center">
                      <div className={`text-sm font-black ${action.color}`}>{action.label}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{action.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* System Health (Compact Vertical) */}
            <div className="lg:col-span-4 bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">系統狀態</h3>
                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/20 rounded border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-400">NORMAL</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {[
                  { label: 'API Gateway', val: '99.9%', status: 'bg-emerald-500' },
                  { label: 'Database IO', val: '12ms', status: 'bg-emerald-500' },
                  { label: '1999 Sync', val: 'Active', status: 'bg-blue-500' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-300">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{s.val}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.status}`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px]"></div>
            </div>
          </div>

          {/* ROW 2: Performance Metrics (Compact) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">平均結案時間</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">1.2h</div>
                <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                  <ArrowDownRight size={12} /> 比上週快 15%
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">今日系統活躍度</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">98%</div>
                <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                  <TrendingUp size={12} /> 高峰負載穩定
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI 輔助使用率</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">64%</div>
                <div className="text-[10px] font-bold text-indigo-500 flex items-center gap-1 mt-1">
                  <ArrowUpRight size={12} /> 持續上升中
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
