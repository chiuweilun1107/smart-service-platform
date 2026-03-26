import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, User, Calendar, AlertCircle, CheckCircle,
  ArrowLeft, Clock, Zap, Shield, MoreHorizontal, MessageSquare,
  Save, ChevronRight, FileText, Component, Camera, History,
  Gavel, Ban, Forward, FileCheck, AlertTriangle, GitMerge, Copy,
  Siren, ArrowRight, Ambulance, Heart
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Case, User as UserType, Workflow } from '../../types/schema';
import { Textarea } from '../../components/common';

export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCase] = useState<Case | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Mock duplicate checking
  const [hasDuplicate] = useState(false); // Disable duplicate for this unique case

  useEffect(() => {
    const loadData = async () => {
      try {
        // Mocking the specific Egret Data override for demonstration
        const mockEgretCase: Case = {
          id: 'C20260122009',
          title: '受傷白鷺鷥待援 (Injured Egret)',
          status: 'processing',
          priority: 'critical',
          type: 'Wildlife Rescue' as any,
          description: '岸邊發現一隻腿部受傷、無法飛行的白鷺鷥。看似虛弱，需要救援。',
          location: '淡水區中正路岸邊',
          coordinates: { lat: 25.17, lng: 121.44 },
          reporterName: '林小姐',
          reporterPhone: '0912-345-678',
          createdAt: '2026-01-22T10:00:00Z',
          assignedTo: 'u2', // Mock user ID
          updatedAt: '2026-01-22T10:15:00Z',
          date: '2026-01-22',
          workflowStage: 'investigation' as any
        };

        const [userList] = await Promise.all([
          mockApi.getUsers(),
        ]);

        setCase(mockEgretCase);
        setUsers(userList);
        if (mockEgretCase.assignedTo) setSelectedUser(mockEgretCase.assignedTo);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load case:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleUpdateStatus = async (newStatus: any) => {
    if (caseData) setCase({ ...caseData, status: newStatus });
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-black">LOADING CASE...</div>;
  if (!caseData) return <div className="p-20 text-center text-red-500 font-black">無法讀取案件資料</div>;

  const assignedUser = users.find(u => u.id === caseData.assignedTo);

  // Status mapping
  const statusMap: Record<string, string> = {
    'pending': '待處理',
    'processing': '處理中',
    'resolved': '已結案',
    'rejected': '已駁回'
  };

  return (
    <div className="h-screen flex flex-col gap-4 animate-in fade-in duration-500 overflow-hidden pb-4">
      {/* 1. Top Header Bar (Ultra Compact) */}
      <div className="flex items-center justify-between shrink-0 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] font-mono">{caseData.id}</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-black uppercase tracking-wider">{caseData.priority} PRIORITY</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{caseData.title}</h1>
          </div>
          {hasDuplicate && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg animate-pulse">
              <GitMerge size={14} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-600">偵測到重複案件</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">通報於 {new Date(caseData.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[9px] font-black text-slate-400 uppercase">Current Status</div>
              <div className="text-sm font-black text-blue-600">{statusMap[caseData.status]}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600">
              <Zap size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three-Column Decision Dashboard (Grid) */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">

        {/* Column 1: Public Input (民眾回報) */}
        <div className="col-span-3 bg-white rounded-[2rem] border border-slate-100 p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <User className="text-indigo-500" size={16} />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">民眾通報資訊</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Reporter */}
            <div className="bg-indigo-50/50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-indigo-300 uppercase">Reporter</span>
                <span className="text-[10px] font-bold text-indigo-700">{caseData.reporterName}</span>
              </div>
              <div className="text-xs font-black text-indigo-900">{caseData.reporterPhone}</div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">問題描述 (Description)</span>
              <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {caseData.description}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">發生地點 (Location)</span>
              <div className="h-32 bg-slate-100 rounded-xl relative overflow-hidden group">
                {/* Fake Map */}
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                  <MapPin size={24} className="text-slate-400" />
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-mono font-bold shadow-sm">
                  {caseData.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Investigation (外勤調查) */}
        <div className="col-span-5 bg-slate-900 rounded-[2rem] p-6 text-white flex flex-col gap-5 shadow-xl shadow-slate-900/10 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Siren className="text-emerald-400 animate-pulse" size={18} />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">外勤調查與回報</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-300">LIVE UPDATES</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto z-10 pr-2 space-y-5">
            {/* Officer Status */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 font-black text-lg">
                {assignedUser?.name?.[0] || '李'}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-blue-300 font-bold uppercase mb-0.5">Assigned Officer</div>
                <div className="text-base font-black text-white">{assignedUser?.name || '李承辦人'}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-200 rounded">動物救援隊</span>
                  <span className="text-[10px] text-slate-400">已接觸目標 5 分鐘</span>
                </div>
              </div>
            </div>

            {/* Field Findings (Updated for Egret) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase">現場回報紀錄 (Field Notes)</span>
                <span className="text-[10px] font-black text-emerald-400">最新更新: 11:20</span>
              </div>
              <div className="bg-white/10 border border-white/5 p-4 rounded-2xl space-y-3">
                <p className="text-sm text-slate-200 leading-relaxed">
                  已發現目標白鷺鷥。初步檢視左腳有開放性骨折，翅膀無明顯外傷但無法飛行。鳥隻意識清楚但非常虛弱。現場評估不宜原地野放。
                </p>
                <div className="flex items-center gap-2 p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <Heart size={14} className="text-emerald-400" />
                  <span className="text-xs font-black text-emerald-100">外勤建議：緊急後送醫療 (Medical Rescue)</span>
                </div>
              </div>
            </div>

            {/* Evidence Photos (Birds) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1574068468668-a05a11f871da?q=80&w=2574" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/50 px-1 rounded text-white">Target: Egret</div>
              </div>
              <div className="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1547963428-b80c1eb48a4e?q=80&w=2670" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/50 px-1 rounded text-white">Injury Detail</div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Decision Console (裁決動作) */}
        <div className="col-span-4 bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col shadow-lg shadow-slate-200/50">
          <div className="flex items-center gap-2 pb-4 mb-2 border-b border-slate-50">
            <Gavel className="text-slate-900" size={18} />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">決策中控台 (Decision Console)</h3>
          </div>

          <div className="flex-1 flex flex-col gap-6">

            {/* 1. Primary Action (Updated for Rescue) */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">建議處置 (Recommended)</span>
                <span className="text-[10px] font-bold text-emerald-500 animate-pulse">High Confidence</span>
              </div>
              <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95">
                <Ambulance size={24} />
                確認後送醫療
              </button>
              <p className="text-[10px] text-slate-400 text-center">此動作將通知合作獸醫院並列印後送單</p>
            </div>

            {/* 2. Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-black text-xs border border-slate-200 flex flex-col items-center gap-1 transition-colors">
                <Forward size={16} className="text-blue-500" />
                轉送野鳥學會
              </button>
              <button className="py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-black text-xs border border-slate-200 flex flex-col items-center gap-1 transition-colors">
                <Ban size={16} className="text-slate-500" />
                暫緩/觀察
              </button>
            </div>

            {/* 3. Final Notes & Close */}
            <div className="mt-auto space-y-3 pt-4 border-t border-slate-50">
              <Textarea
                className="h-24 text-xs"
                placeholder="輸入救援備註 (Optional)..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
              <button
                onClick={() => handleUpdateStatus('resolved')}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={14} /> 結案存檔 (Archive Case)
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
