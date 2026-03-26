import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Loader2, ArrowRight, Search, Users, ArrowLeft } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { TextInput } from '../../components/common';

type LoginTab = 'citizen' | 'staff';

export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<LoginTab>('citizen');

    // Auth States
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password');
    const [caseId, setCaseId] = useState('ANS-20231120001');
    const [phone, setPhone] = useState('0912-345-678');
    const [captcha, setCaptcha] = useState('8832');
    const [captchaCode, setCaptchaCode] = useState('8832');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        setCaptcha('8832');
        setCaptchaCode('8832');
        if (activeTab === 'staff') {
            setUsername('admin');
            setPassword('password');
        }
    }, [activeTab]);

    const refreshCaptcha = () => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setCaptchaCode(code);
        setCaptcha(code);
    };

    const ACCOUNT_DISPLAY: Record<string, { role: string; name: string }> = {
        'admin':          { role: 'admin',      name: '王管理員' },
        'caseworker01':   { role: 'caseworker', name: '李承辦人' },
        'caseworker02':   { role: 'caseworker', name: '陳承辦人' },
        'supervisor':     { role: 'supervisor', name: '張主管' },
        'contractor01':   { role: 'contractor', name: '林志遠' },
        'contractor02':   { role: 'contractor', name: '吳建宏' },
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (captcha !== captchaCode) {
            setLoading(false);
            setError('驗證碼錯誤');
            return;
        }

        try {
            const account = ACCOUNT_DISPLAY[username];
            if (account) {
                localStorage.setItem('auth_token', `mock_${account.role}_token`);
                localStorage.setItem('auth_role', account.role);
                localStorage.setItem('auth_username', username);
                localStorage.setItem('auth_display_name', account.name);
                navigate(account.role === 'contractor' ? '/map' : '/admin/dashboard');
            } else {
                setError('帳號或密碼錯誤');
            }
        } catch (err) {
            setError('登入失敗');
        } finally {
            setLoading(false);
        }
    };

    const handleCitizenQueryFast = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (captcha !== captchaCode) {
            setLoading(false);
            setError('驗證碼錯誤');
            return;
        }

        setTimeout(() => {
            setLoading(false);
            navigate(`/status?id=${caseId}`);
        }, 1200);
    };

    const fb = `w-full px-6 py-3 text-sm font-black rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3`;

    const CaptchaField = () => (
        <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">驗證碼</label>
            <div className="flex gap-3">
                <TextInput
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    placeholder="輸入驗證碼"
                    autoComplete="off"
                    variant="light"
                    className="flex-1"
                />
                <div
                    onClick={refreshCaptcha}
                    className="w-40 bg-slate-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-200 select-none relative group overflow-hidden border border-slate-200"
                >
                    <span className="text-3xl font-black text-slate-500 tracking-[0.4em] italic font-serif z-10">{captchaCode}</span>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')]"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex overflow-hidden font-sans relative">

            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-50 flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-x-1 group"
            >
                <ArrowLeft size={16} className="group-hover:text-blue-400 transition-colors" />
                返回首頁
            </Link>

            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_1.3fr]">

                {/* Left Side Visual */}
                <div className="hidden lg:flex flex-col justify-between p-16 xl:p-24 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[150px]"></div>
                        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]"></div>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                        <div className="absolute left-[15%] top-0 w-px h-full bg-gradient-to-b from-white/0 via-white/5 to-white/0"></div>
                        <div className="absolute top-[35%] left-0 w-full h-px bg-gradient-to-r from-white/0 via-white/5 to-white/0"></div>
                    </div>

                    <div className="relative z-10 pt-16">
                        <div className="inline-block px-5 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-12">
                            安全認證入口
                        </div>
                        <h1 className="text-5xl xl:text-7xl 2xl:text-8xl font-black text-white tracking-tighter leading-tight mb-10">
                            智慧勤務<br />
                            <span className="text-blue-500">管理平台</span>
                        </h1>
                        <p className="text-slate-400 text-lg xl:text-xl leading-relaxed max-w-md font-medium">
                            整合市民案件追蹤與內部公務執行的一站式入口，呈現數位效率與透明治理的極致平衡。
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl max-w-sm">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                                <Shield size={32} />
                            </div>
                            <div>
                                <div className="text-white font-black text-sm uppercase tracking-[0.3em] mb-1">全面防護</div>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">安全性與存取控制</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="p-8 md:p-12 xl:p-16 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-6">
                            <div className="flex gap-6 border-b-2 border-slate-50">
                                {([
                                    { id: 'citizen', label: '民眾服務', icon: Search },
                                    { id: 'staff',   label: '人員登入', icon: Users },
                                ] as const).map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`pb-4 flex items-center gap-2 text-sm font-black tracking-[0.15em] uppercase transition-all relative ${isActive ? 'text-blue-600' : 'text-slate-300 hover:text-slate-500'}`}
                                        >
                                            <tab.icon size={16} />
                                            {tab.label}
                                            {isActive && (
                                                <div className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-blue-600 rounded-full animate-in slide-in-from-left duration-300" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-2">
                            {activeTab === 'citizen' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 mb-1">案件進度查詢</h2>
                                        <p className="text-slate-400 text-sm font-medium">請點擊下方按鈕直接體驗案件追蹤功能。</p>
                                    </div>

                                    <form onSubmit={handleCitizenQueryFast} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">案件編號</label>
                                            <TextInput
                                                type="text"
                                                value={caseId}
                                                onChange={(e) => setCaseId(e.target.value)}
                                                autoComplete="off"
                                                variant="light"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">驗證資訊</label>
                                            <TextInput
                                                type="text"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                autoComplete="off"
                                                variant="light"
                                            />
                                        </div>

                                        <CaptchaField />

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`${fb} bg-slate-950 text-white hover:bg-blue-600`}
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>確認查詢 <ArrowRight size={16} /></>}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'staff' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">人員登入</h2>
                                        <p className="text-slate-400 text-sm font-medium mt-1">角色權限由帳號自動判別。</p>
                                        <div className="flex gap-1.5 mt-3">
                                            {[
                                                { label: '管理員', user: 'admin', pass: 'password' },
                                                { label: '承辦', user: 'caseworker01', pass: 'password123' },
                                                { label: '外包', user: 'contractor01', pass: 'contractor123' },
                                            ].map(({ label, user, pass }) => (
                                                <button
                                                    key={user}
                                                    type="button"
                                                    onClick={() => { setUsername(user); setPassword(pass); }}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-500 transition-all"
                                                >
                                                    Demo · {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">帳號</label>
                                            <TextInput
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                autoComplete="username"
                                                variant="light"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">密碼</label>
                                            <TextInput
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="current-password"
                                                variant="light"
                                            />
                                        </div>

                                        <CaptchaField />

                                        {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-black rounded-xl border border-red-100">{error}</div>}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`${fb} text-white bg-blue-600 hover:bg-blue-500`}
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>立即登入 <ArrowRight size={16} /></>}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">© 2026 新北市政府動物保護防疫處</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
