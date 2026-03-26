import { ReactNode, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AIAnalysisModal } from './AIAnalysisModal';

interface ChartWithAIAnalysisProps {
    title: string;
    children: ReactNode;
    analysis: string;
    insight?: string;
}

export function ChartWithAIAnalysis({ title, children, analysis, insight }: ChartWithAIAnalysisProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="relative">
                {/* AI 分析按鈕 */}
                <button
                    onClick={() => setShowModal(true)}
                    className="absolute top-4 right-4 z-10 p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all group"
                    title="AI 數據分析"
                >
                    <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                {/* 圖表內容 */}
                {children}
            </div>

            {/* AI 分析彈跳視窗 */}
            <AIAnalysisModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={title}
                analysis={analysis}
                insight={insight}
            />
        </>
    );
}
