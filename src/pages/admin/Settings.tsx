import { useEffect, useState } from 'react';
import {
  Save, RefreshCw, Shield, Globe, Bell,
  Database, Cpu, Clock, CheckCircle,
  Zap, HardDrive, Lock, User
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { SystemConfig } from '../../types/schema';

export function SettingsPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getSystemConfig();
      setConfigs(data);
      const values: Record<string, any> = {};
      data.forEach(c => {
        values[c.key] = c.value;
      });
      setFormValues(values);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormValues({ ...formValues, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing System Core...</p>
      </div>
    );
  }

  const categories = [
    { id: 'general', label: '基礎設置', icon: <Globe size={18} /> },
    { id: 'security', label: '資安等級', icon: <Shield size={18} /> },
    { id: 'notification', label: '通知矩陣', icon: <Bell size={18} /> },
    { id: 'database', label: '備份存檔', icon: <Database size={18} /> }
  ];

  const filteredConfigs = configs.filter(c => {
    if (activeTab === 'general') return c.category === 'general' || c.category === 'case';
    if (activeTab === 'database') return c.category === 'backup';
    return false;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">核心核心</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">系統配置</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadConfigs}
            className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-900 transition-all flex items-center justify-center"
            title="Reload"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <Save size={18} /> 提交變更
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle size={18} /> 系統參數已成功同步
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Side Navigation */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 space-y-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === cat.id ? 'bg-slate-950 text-white shadow-xl shadow-slate-950/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Settings Panel */}
        <div className="lg:col-span-9 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                {categories.find(c => c.id === activeTab)?.icon}
              </div>
              <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                {categories.find(c => c.id === activeTab)?.label} 調整
              </h3>
            </div>

            <div className="space-y-8 max-w-2xl">
              {filteredConfigs.length > 0 ? (
                filteredConfigs.map(config => (
                  <div key={config.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {config.description}
                      </label>
                      <span className="text-[9px] font-mono text-slate-300 tracking-tight">{config.key}</span>
                    </div>
                    {config.key === 'system_language' ? (
                      <select
                        value={formValues[config.key]}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900 appearance-none"
                      >
                        <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
                        <option value="en-US">English (US)</option>
                      </select>
                    ) : config.key === 'system_timezone' ? (
                      <select
                        value={formValues[config.key]}
                        onChange={(e) => handleChange(config.key, e.target.value)}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900 appearance-none"
                      >
                        <option value="Asia/Taipei">Asia/Taipei (UTC+8)</option>
                        <option value="UTC">Universal Coordinated Time (UTC)</option>
                      </select>
                    ) : (
                      <input
                        type={typeof config.value === 'number' ? 'number' : 'text'}
                        value={formValues[config.key]}
                        onChange={(e) => handleChange(config.key, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-6">
                  <Lock size={48} className="mx-auto text-slate-100" />
                  <p className="text-xl font-black text-slate-300 uppercase tracking-widest">保留用於安全大修</p>
                  <button className="px-6 py-3 border border-slate-200 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">申請管理員存取</button>
                </div>
              )}
            </div>
          </div>

          {/* Hardware / Engine Metrics */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white">
                <Cpu className="text-blue-500 mb-6" size={24} />
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">計算負載</h4>
                <div className="text-3xl font-black mb-4">42.8%</div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 w-[42.8%] h-full"></div>
                </div>
              </div>
              <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white">
                <HardDrive className="text-emerald-500 mb-6" size={24} />
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">存儲持久性</h4>
                <div className="text-3xl font-black mb-4">2.4 TB</div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 w-[78%] h-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
