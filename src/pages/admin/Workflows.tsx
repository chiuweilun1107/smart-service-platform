import { useEffect, useState } from 'react';
import {
  Plus, Edit3, Eye, Zap,
  ArrowRight, CheckCircle, Clock,
  Settings, Copy, Trash2, Shield,
  Activity, ChevronRight
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Workflow, WorkflowStep } from '../../types/schema';

export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getWorkflows();
      setWorkflows(data);
      if (data.length > 0) setSelectedWorkflow(data[0]);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Neural Pathways...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mb-2">流程引擎</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">業務工作流</h1>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-yellow-500 transition-all flex items-center gap-2">
          <Plus size={18} /> 配置新序列
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Workflow Registry Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">活躍登記簿</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {workflows.map(wf => (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`w-full text-left px-8 py-6 transition-all group relative overflow-hidden ${selectedWorkflow?.id === wf.id ? 'bg-white' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between gap-4 relative z-10">
                    <div>
                      <p className={`font-black text-sm uppercase tracking-tight ${selectedWorkflow?.id === wf.id ? 'text-slate-900' : 'text-slate-500'}`}>
                        {wf.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        ID: {wf.id} • {wf.type}
                      </p>
                    </div>
                    <div className={`transition-transform duration-500 ${selectedWorkflow?.id === wf.id ? 'translate-x-0' : 'translate-x-8 opacity-0'}`}>
                      <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                  {selectedWorkflow?.id === wf.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status Info Card */}
          <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <Activity className="text-yellow-500 mb-6" size={28} />
              <h4 className="text-lg font-black tracking-tighter mb-4 uppercase">系統狀態指令集</h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                目前共有 {workflows.length} 組核心工作流正在執行中。所有異動皆會紀錄於 Audit Logs 供日後稽核抽查。
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full"></div>
          </div>
        </div>

        {/* Workflow Logic Canvas */}
        {selectedWorkflow && (
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">{selectedWorkflow.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedWorkflow.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                      {selectedWorkflow.isActive ? '運行中' : '未啟用'}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    為 {selectedWorkflow.type} 級別實體編譯
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Copy size={18} /></button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Settings size={18} /></button>
                </div>
              </div>

              {/* Logical Steps Visualization */}
              {/* Logical Steps Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {selectedWorkflow.steps.map((step, idx) => (
                  <div key={step.id} className="relative">
                    {/* Connection Arrow for odd items (pointing right) and even items (pointing left/down visually handled by grid flow) 
                        Simulating flow: Item 1 -> Item 2 -> Item 3... 
                    */}
                    {idx < selectedWorkflow.steps.length - 1 && (
                      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                        {/* Simple visual connector for grid - only showing on odd items effectively in 2-col? 
                             Actually, let's keep it simple: Just arrows inside the cards or between them?
                             Let's put an arrow icon absolute positioned on the right of odd items.
                         */}
                        {idx % 2 === 0 && <ArrowRight size={24} />}
                      </div>
                    )}

                    <div className="h-full bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-[1.5rem] p-5 border border-slate-100 flex flex-col relative group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all duration-500 shrink-0 ${step.status === 'completed'
                              ? 'bg-slate-950 text-white shadow-md'
                              : 'bg-white border-2 border-slate-100 text-slate-300'
                            }`}>
                            {step.order}
                          </div>
                          <h4 className="text-xl font-black tracking-tight text-slate-900 uppercase">{step.name}</h4>
                        </div>
                        {step.status === 'completed' && <CheckCircle size={24} className="text-emerald-500" />}
                      </div>

                      <p className="text-base text-slate-600 font-medium leading-relaxed mb-4 pl-[3.75rem]">
                        {step.description}
                      </p>

                      {step.requiredFields && step.requiredFields.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pl-[3.75rem]">
                          {step.requiredFields.map(field => (
                            <span key={field} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-500 uppercase tracking-wide">
                              {field}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Execution Controls */}
              <div className="mt-12 flex gap-4 pt-12 border-t border-slate-50">
                <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20 hover:bg-yellow-500 transition-all flex items-center justify-center gap-3">
                  <Edit3 size={18} /> 修改序列邏輯
                </button>
                <button className="px-8 py-5 border border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                  停用
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
