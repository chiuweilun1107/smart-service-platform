import { useState } from 'react';
import {
  Download, Filter, Calendar, BarChart3, PieChart,
  FileText, ArrowRight, CheckCircle, AlertCircle, TrendingUp,
  ChevronRight, Zap
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Case } from '../../types/schema';

export function ReportsPage() {
  const [reportType, setReportType] = useState('inspection');
  const [startDate, setStartDate] = useState('2023-11-01');
  const [endDate, setEndDate] = useState('2023-11-30');
  const [caseStatus, setCaseStatus] = useState('');
  const [casePriority, setCasePriority] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const reportTypes = [
    { id: 'inspection', label: '動保評鑑報表', description: '評鑑相關數據統計', icon: <TrendingUp size={20} /> },
    { id: 'visit', label: '家訪報表', description: '家訪工作紀錄', icon: <FileText size={20} /> },
    { id: 'stray_dog', label: '遊蕩犬管理報表', description: '遊蕩犬處理紀錄', icon: <PieChart size={20} /> },
    { id: 'duty_form', label: '勤務三聯單', description: '承辦人勤務記錄', icon: <Zap size={20} /> }
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const filters = {
        ...(caseStatus && { status: caseStatus }),
        ...(casePriority && { priority: casePriority })
      };
      const data = await mockApi.generateReport(reportType, filters);
      setReportData(data);
    } catch (error) {
      console.error('Report generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: string) => {
    alert(`Initiating ${format.toUpperCase()} Protocol Download...`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">情報矩陣</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">報表中心</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Side Selector */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">矩陣分類</h3>
            <div className="space-y-2">
              {reportTypes.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => setReportType(rt.id)}
                  className={`w-full text-left px-6 py-5 rounded-2xl transition-all group relative overflow-hidden ${reportType === rt.id
                      ? 'bg-slate-950 text-white shadow-xl shadow-slate-950/20'
                      : 'hover:bg-slate-50 text-slate-500'
                    }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`transition-colors ${reportType === rt.id ? 'text-blue-400' : 'text-slate-300'}`}>
                      {rt.icon}
                    </div>
                    <div>
                      <p className="font-black text-xs uppercase tracking-widest">{rt.label}</p>
                      <p className={`text-[10px] font-bold mt-1 ${reportType === rt.id ? 'text-slate-400' : 'text-slate-400'}`}>{rt.description}</p>
                    </div>
                  </div>
                  {reportType === rt.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Analytics Preview Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-600/20">
            <BarChart3 className="text-emerald-300 mb-6" size={32} />
            <h4 className="text-xl font-black tracking-tighter mb-4 uppercase">智慧數據分析</h4>
            <p className="text-emerald-100/70 text-sm font-medium leading-relaxed mb-6">
              系統正在背景預先處理 112 年度第四季動保案件分佈數據...
            </p>
            <div className="w-full bg-emerald-950/30 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white w-2/3 h-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Action Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* Configuration */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                <Filter size={20} />
              </div>
              <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">篩選條件校準</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">時間範圍開始</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">時間範圍結束</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">目標狀態</label>
                <select
                  value={caseStatus}
                  onChange={(e) => setCaseStatus(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-xs appearance-none"
                >
                  <option value="">全部狀態</option>
                  <option value="pending">待審核</option>
                  <option value="processing">進行中</option>
                  <option value="resolved">已完成</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">優先級向量</label>
                <select
                  value={casePriority}
                  onChange={(e) => setCasePriority(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-xs appearance-none"
                >
                  <option value="">所有優先級</option>
                  <option value="critical">CRITICAL</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full mt-10 bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-950/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <TrendingUp size={18} />}
              {loading ? '初始化資料流...' : '提交報表生成'}
            </button>
          </div>

          {/* Result Interface */}
          {reportData ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">資料矩陣輸出</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">即時預覽</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDownload('odt')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">ODF 協議</button>
                  <button onClick={() => handleDownload('pdf')} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">匯出 PDF</button>
                  <button onClick={() => handleDownload('xlsx')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">匯出 Excel</button>
                </div>
              </div>

              <div className="p-10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / 向量</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">類型</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">狀態</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">實體名稱</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reportData.data.slice(0, 6).map((item: Case) => (
                      <tr key={item.id} className="group">
                        <td className="py-6">
                          <div className="text-xs font-black text-blue-600 font-mono mb-1">{item.id}</div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</div>
                        </td>
                        <td className="py-6 text-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                        </td>
                        <td className="py-6 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                              item.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                            {item.status}
                          </div>
                        </td>
                        <td className="py-6 text-right">
                          <div className="text-sm font-black text-slate-900">{item.reporterName}</div>
                          <div className="text-[10px] font-bold text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    流結束 • 共編譯 {reportData.data.length} 筆記錄
                  </div>
                  <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                    載入完整集合 <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 p-32 text-center">
              <div className="flex flex-col items-center opacity-20">
                <TrendingUp size={64} className="mb-6" />
                <p className="text-2xl font-black uppercase tracking-widest text-slate-900">等待校準</p>
                <p className="text-sm font-bold mt-2">調整參數並提交生成以查看情報</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
