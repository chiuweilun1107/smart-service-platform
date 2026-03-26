import { X, Sparkles } from 'lucide-react';

interface AIAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    analysis: string;
    insight?: string;
}

export function AIAnalysisModal({ isOpen, onClose, title, analysis, insight }: AIAnalysisModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* 頭部 */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{title}</h2>
                            <p className="text-blue-100 text-xs uppercase tracking-widest">AI 數據分析</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* 內容 */}
                <div className="p-8 space-y-6">
                    {/* 主要分析 */}
                    <div>
                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-3">
                            📊 數據分析
                        </h3>
                        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                            <p className="text-slate-800 leading-relaxed text-base font-medium">
                                {analysis}
                            </p>
                        </div>
                    </div>

                    {/* 深度洞察 */}
                    {insight && (
                        <div>
                            <h3 className="text-sm font-black text-purple-600 uppercase tracking-widest mb-3">
                                💡 深度洞察
                            </h3>
                            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                                <p className="text-slate-800 leading-relaxed text-base font-medium">
                                    {insight}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 建議行動 */}
                    <div>
                        <h3 className="text-sm font-black text-green-600 uppercase tracking-widest mb-3">
                            ✅ 建議行動
                        </h3>
                        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                            <ul className="space-y-2 text-slate-800 font-medium">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-black mt-0.5">•</span>
                                    <span>關注異常變化趨勢，及時調整工作分配</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-black mt-0.5">•</span>
                                    <span>定期檢視報告數據，優化案件處理流程</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-black mt-0.5">•</span>
                                    <span>積極跟進超期或高優先級案件</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 底部 */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        🤖 由 AI 系統生成 • 建議內容僅供參考
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
}
