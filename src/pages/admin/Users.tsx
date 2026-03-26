import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, Search, Filter,
  ShieldCheck, UserCheck, ShieldAlert,
  Mail, Phone, Clock, MoreVertical, X
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { User } from '../../types/schema';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'caseworker' as const,
    unit: '',
    phone: '',
    status: 'active' as const
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await mockApi.updateUser(editingId, formData);
        setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
      } else {
        const newId = await mockApi.createUser(formData as any);
        setUsers([...users, { id: newId, ...formData, createdAt: new Date().toISOString() }]);
      }
      resetForm();
    } catch (error) {
      console.error('Save failed');
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      unit: user.unit,
      phone: user.phone || '',
      status: user.status
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'caseworker', unit: '', phone: '', status: 'active' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-red-100"><ShieldAlert size={12} /> 管理員</span>;
      case 'supervisor': return <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-100"><ShieldCheck size={12} /> 主管</span>;
      default: return <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-100"><UserCheck size={12} /> 承辦人</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">存取管理</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">用戶及身份</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-indigo-600 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> 新增系統用戶
        </button>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="搜尋用戶、電子郵件或所屬單位..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all font-bold text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            <Filter size={18} /> 篩選
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            匯出 CSV
          </button>
        </div>
      </div>

      {/* User List Grid/Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">用戶檔案</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">存取角色</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">部門單位</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">內部聯絡</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">帳戶狀態</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">設定</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-10">
                    <div className="h-8 bg-slate-100 rounded-xl w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black text-lg">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900 tracking-tight leading-tight">{user.name}</div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-8 py-8">
                  <div className="text-sm font-bold text-slate-900">{user.unit}</div>
                </td>
                <td className="px-8 py-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Mail size={12} className="text-slate-300" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                      <Phone size={12} className="text-slate-300" /> {user.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-8">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-emerald-500' : 'text-slate-400'
                    }`}>
                    ● {user.status}
                  </span>
                </td>
                <td className="px-8 py-8 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                {editingId ? '編輯設定' : '內部身份配置'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">完整姓名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-sm"
                    placeholder="輸入姓名" required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">公務信箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-sm"
                    placeholder="email@unit.gov" required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">存取層級</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-sm appearance-none"
                  >
                    <option value="admin">系統管理員</option>
                    <option value="supervisor">地區主管</option>
                    <option value="caseworker">業務執行官</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">組織單位</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-sm"
                    placeholder="分組 / 單位"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">帳戶狀態</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${formData.status === 'active' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                  >
                    啟用部署
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'inactive' })}
                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${formData.status === 'inactive' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                  >
                    暫停存取
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:bg-black transition-all mt-4">
                {editingId ? '更新身份序列' : '提交新配置'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
