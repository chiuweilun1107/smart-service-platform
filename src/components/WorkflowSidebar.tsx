import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, Clock, FileCheck, FileText } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import type { Case, CaseWorkflowStage } from '../types/schema';

interface WorkflowMenuItem {
    items: Case[];
    label: string;
    unresolvedCount: number;
}

interface WorkflowMenuItems {
    receipt: WorkflowMenuItem;
    assignment: WorkflowMenuItem;
    undertaker: WorkflowMenuItem;
    public: WorkflowMenuItem;
}

interface WorkflowSidebarProps {
    selectedCaseId?: string;
    onSelectCase?: (caseId: string) => void;
    isLoading?: boolean;
}

const stageIcons: Record<CaseWorkflowStage, React.ReactNode> = {
    'receipt': <AlertCircle size={18} />,
    'assignment': <Clock size={18} />,
    'undertaker': <FileCheck size={18} />,
    'public': <FileText size={18} />,
};

const stageColors: Record<CaseWorkflowStage, string> = {
    'receipt': 'text-red-500 bg-red-50',
    'assignment': 'text-orange-500 bg-orange-50',
    'undertaker': 'text-blue-500 bg-blue-50',
    'public': 'text-green-500 bg-green-50',
};

export function WorkflowSidebar({
    selectedCaseId,
    onSelectCase,
    isLoading = false
}: WorkflowSidebarProps) {
    const [menuItems, setMenuItems] = useState<WorkflowMenuItems | null>(null);
    const [expandedStages, setExpandedStages] = useState<Set<CaseWorkflowStage>>(new Set(['receipt']));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkflowMenuItems();
    }, []);

    const loadWorkflowMenuItems = async () => {
        try {
            setLoading(true);
            const items = await mockApi.getWorkflowMenuItems();
            setMenuItems(items as unknown as WorkflowMenuItems);
        } catch (error) {
            console.error('Failed to load workflow menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStageExpansion = (stage: CaseWorkflowStage) => {
        const newExpanded = new Set(expandedStages);
        if (newExpanded.has(stage)) {
            newExpanded.delete(stage);
        } else {
            newExpanded.add(stage);
        }
        setExpandedStages(newExpanded);
    };

    const stages: CaseWorkflowStage[] = ['receipt', 'assignment', 'undertaker', 'public'];

    return (
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
            {/* 頭部 */}
            <div className="sticky top-0 bg-white p-6 border-b border-slate-200 z-10">
                <h2 className="text-xl font-black text-slate-900">工作流程</h2>
            </div>

            {/* 菜單項目 */}
            <div className="flex-1 overflow-y-auto">
                {loading || isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin">
                            <Clock size={24} className="text-slate-400" />
                        </div>
                    </div>
                ) : menuItems ? (
                    <div className="space-y-2 p-4">
                        {stages.map(stage => {
                            const item = menuItems[stage];
                            const isExpanded = expandedStages.has(stage);
                            const hasUnresolved = item.unresolvedCount > 0;

                            return (
                                <div key={stage} className="space-y-1">
                                    {/* 階段菜單頭 */}
                                    <button
                                        onClick={() => toggleStageExpansion(stage)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                                            isExpanded
                                                ? 'bg-slate-100 text-slate-900'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`${stageColors[stage]} p-2 rounded-lg`}>
                                                {stageIcons[stage]}
                                            </div>
                                            <span>{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasUnresolved && (
                                                <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full">
                                                    {item.unresolvedCount > 99 ? '99+' : item.unresolvedCount}
                                                </div>
                                            )}
                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                    </button>

                                    {/* 案件列表 */}
                                    {isExpanded && (
                                        <div className="space-y-1 pl-2">
                                            {item.items.length > 0 ? (
                                                item.items.map(caseItem => {
                                                    const isSelected = selectedCaseId === caseItem.id;
                                                    const isUnresolved =
                                                        caseItem.status !== 'resolved' &&
                                                        caseItem.status !== 'rejected' &&
                                                        caseItem.status !== 'archived';

                                                    return (
                                                        <button
                                                            key={caseItem.id}
                                                            onClick={() => onSelectCase?.(caseItem.id)}
                                                            className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all ${
                                                                isSelected
                                                                    ? 'bg-slate-900 text-white font-semibold'
                                                                    : isUnresolved
                                                                    ? 'bg-red-50 text-red-900 hover:bg-red-100'
                                                                    : 'text-slate-600 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            <div className="truncate font-semibold">
                                                                {caseItem.title}
                                                            </div>
                                                            <div className="text-xs opacity-75 truncate">
                                                                {caseItem.id}
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="px-4 py-3 text-center text-xs text-slate-400">
                                                    無案件
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>

            {/* 底部統計 */}
            {menuItems && (
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                    <div className="text-xs text-slate-600 space-y-2">
                        <div className="flex justify-between">
                            <span>總案件數：</span>
                            <span className="font-semibold">
                                {stages.reduce((sum, s) => sum + menuItems[s].items.length, 0)}
                            </span>
                        </div>
                        <div className="flex justify-between text-red-600 font-semibold">
                            <span>未處理：</span>
                            <span>
                                {stages.reduce((sum, s) => sum + menuItems[s].unresolvedCount, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
