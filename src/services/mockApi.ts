// src/services/mockApi.ts
import type {
    Case, User, Role, Permission, Workflow,
    ProxyAssignment, AuditLog, SystemConfig, IntegrationConfig,
    CaseWorkflowStage
} from '../types/schema';
import { mockCases } from './mockCases';

// 模擬延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ===== 模擬數據集合 =====

// 用戶數據
const mockUsers: User[] = [
    { id: 'u1', name: '王管理員', email: 'wang.admin@gov.tw', role: 'admin', unit: '動保處', phone: '0912345678', status: 'active', createdAt: '2025-01-01' },
    { id: 'u2', name: '李承辦人', email: 'li.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0987654321', status: 'active', createdAt: '2025-01-05' },
    { id: 'u3', name: '張主管', email: 'zhang.supervisor@gov.tw', role: 'supervisor', unit: '動保處', phone: '0923456789', status: 'active', createdAt: '2025-01-05' },
    { id: 'u4', name: '陳承辦人', email: 'chen.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0934567890', status: 'active', createdAt: '2025-01-10' },
    { id: 'u5', name: '黃承辦人', email: 'huang.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0945678901', status: 'inactive', createdAt: '2025-01-15' },
];

// 角色定義
const mockRoles: Role[] = [
    {
        id: 'r1',
        name: '管理員',
        permissions: ['case:create', 'case:read', 'case:update', 'case:delete', 'user:manage', 'role:manage', 'workflow:manage', 'report:view', 'audit:view'],
        description: '系統管理員，擁有所有權限'
    },
    {
        id: 'r2',
        name: '承辦人',
        permissions: ['case:read', 'case:update', 'case:dispatch', 'report:view'],
        description: '案件承辦人，可查詢和更新分派的案件'
    },
    {
        id: 'r3',
        name: '主管',
        permissions: ['case:read', 'case:approve', 'report:view', 'report:export', 'audit:view'],
        description: '部門主管，可審核和查看報表'
    },
];

// 權限定義
const mockPermissions: Permission[] = [
    { id: 'case:create', name: '新增案件', category: 'case', description: '允許新增案件' },
    { id: 'case:read', name: '查詢案件', category: 'case', description: '允許查詢案件' },
    { id: 'case:update', name: '編輯案件', category: 'case', description: '允許編輯案件' },
    { id: 'case:delete', name: '刪除案件', category: 'case', description: '允許刪除案件' },
    { id: 'case:dispatch', name: '分派案件', category: 'case', description: '允許分派案件給承辦人' },
    { id: 'case:approve', name: '審核案件', category: 'case', description: '允許審核和批准案件' },
    { id: 'user:manage', name: '管理用戶', category: 'user', description: '允許管理用戶帳號' },
    { id: 'role:manage', name: '管理角色', category: 'role', description: '允許管理角色和權限' },
    { id: 'workflow:manage', name: '管理工作流', category: 'workflow', description: '允許配置工作流程' },
    { id: 'report:view', name: '查詢報表', category: 'report', description: '允許查詢報表' },
    { id: 'report:export', name: '匯出報表', category: 'report', description: '允許匯出報表' },
    { id: 'audit:view', name: '查詢審計日誌', category: 'audit', description: '允許查詢審計日誌' },
];

// 案件數據已在 mockCases.ts 中定義，此處導入使用

// 工作流程定義
const mockWorkflows: Workflow[] = [
    {
        id: 'wf1',
        name: '一般案件流程',
        type: 'general',
        steps: [
            { id: 's1', name: '通報接收', order: 1, status: 'completed', description: '接收民眾通報' },
            { id: 's2', name: '初審', order: 2, status: 'pending', description: '初步審查案件內容' },
            { id: 's3', name: '分派', order: 3, status: 'pending', description: '分派給承辦人' },
            { id: 's4', name: '執行', order: 4, status: 'pending', description: '承辦人執行現場勘查' },
            { id: 's5', name: '回報', order: 5, status: 'pending', description: '承辦人回報結果' },
            { id: 's6', name: '結案', order: 6, status: 'pending', description: '案件結案歸檔' },
        ],
        isActive: true,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z'
    },
    {
        id: 'wf2',
        name: '蜂案處理流程',
        type: 'bee',
        steps: [
            { id: 's1', name: '通報接收', order: 1, status: 'completed', description: '接收蜂案通報' },
            { id: 's2', name: '危險評估', order: 2, status: 'pending', description: '評估蜂窩危險程度' },
            { id: 's3', name: '緊急分派', order: 3, status: 'pending', description: '緊急分派相關單位' },
            { id: 's4', name: '現場處理', order: 4, status: 'pending', description: '現場蜂窩移除處理' },
            { id: 's5', name: '驗收回報', order: 5, status: 'pending', description: '驗收並回報完成' },
        ],
        isActive: true,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z'
    },
];

// 代理人設定
const mockProxies: ProxyAssignment[] = [
    {
        id: 'px1',
        from: 'u5',
        to: 'u2',
        startDate: '2026-01-15',
        endDate: '2026-02-15',
        reason: '公假期間',
        status: 'active'
    }
];

// 審計日誌
const mockAuditLogs: AuditLog[] = [
    {
        id: 'a1',
        userId: 'u1',
        action: 'case:create',
        resource: 'case',
        resourceId: 'C20260121001',
        changes: { after: { title: '信義路流浪犬通報', priority: 'high' } },
        metadata: { ip: '192.168.1.101', location: 'TPE-HQ' },
        timestamp: '2026-01-21T08:00:00Z'
    },
    {
        id: 'a2',
        userId: 'u1',
        action: 'case:assign',
        resource: 'case',
        resourceId: 'C20260121002',
        changes: { before: { assignedTo: null }, after: { assignedTo: 'u2' } },
        metadata: { ip: '192.168.1.101', location: 'TPE-HQ' },
        timestamp: '2026-01-21T08:15:00Z'
    },
    {
        id: 'a3',
        userId: 'u2',
        action: 'auth:login',
        resource: 'system',
        resourceId: 'session_892',
        metadata: { ip: '61.220.128.5', userAgent: 'Chrome/120.0', location: '外部網路' },
        timestamp: '2026-01-21T09:00:00Z'
    },
    {
        id: 'a4',
        userId: 'u3',
        action: 'pii:view',
        resource: 'user_data',
        resourceId: 'u5_phone',
        metadata: { ip: '10.0.5.22', reason: '人員考核審查', alertLevel: 'medium' },
        timestamp: '2026-01-21T10:30:00Z'
    },
    {
        id: 'a5',
        userId: 'u1',
        action: 'report:export_batch',
        resource: 'report',
        resourceId: 'REP_2024_Q1',
        changes: { count: 5000, format: 'xlsx' },
        metadata: { ip: '192.168.1.101', alertLevel: 'high', warning: '偵測到大量資料匯出' },
        timestamp: '2026-01-21T11:45:00Z'
    },
    {
        id: 'a6',
        userId: 'u2',
        action: 'case:update',
        resource: 'case',
        resourceId: 'C20260121001',
        changes: {
            before: { status: 'pending', priority: 'high' },
            after: { status: 'processing', priority: 'medium' }
        },
        metadata: { ip: '61.220.128.5' },
        timestamp: '2026-01-21T13:20:00Z'
    }
];

// 系統設定
const mockSystemConfig: SystemConfig[] = [
    { key: 'system_timezone', value: 'Asia/Taipei', description: '系統時區', category: 'general' },
    { key: 'system_language', value: 'zh-TW', description: '系統語言', category: 'general' },
    { key: 'case_auto_close_days', value: 30, description: '案件自動結案天數', category: 'case' },
    { key: 'backup_schedule', value: 'daily', description: '備份排程', category: 'backup' },
];

// 介接配置
const mockIntegrations: IntegrationConfig[] = [
    {
        id: 'int1',
        name: '1999通報系統',
        type: '1999',
        endpoint: 'https://1999.ntpc.gov.tw/api',
        status: 'connected',
        lastSync: '2026-01-21T10:00:00Z',
        configuration: { apiKey: 'xxxx', syncInterval: 300 }
    },
    {
        id: 'int2',
        name: '農業部寵物登記',
        type: 'agriculture',
        endpoint: 'https://pet.coa.gov.tw/api',
        status: 'connected',
        lastSync: '2026-01-21T09:30:00Z',
        configuration: { apiKey: 'yyyy', syncInterval: 600 }
    },
    {
        id: 'int3',
        name: 'GIS 圖資平台',
        type: 'gis',
        endpoint: 'https://gis.ntpc.gov.tw/wms',
        status: 'suspended',
        lastSync: '2026-01-20T14:20:00Z',
        configuration: { layerId: 'L001', projection: 'EPSG:3826', format: 'GeoJSON' }
    }
];

// ===== 時間序列數據生成 =====
// 生成過去 90 天的時間序列數據（涵蓋本季度）
const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date('2026-01-21');

    for (let i = 89; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // 模擬每日數據變化
        data.push({
            date: dateStr,
            totalCases: Math.floor(Math.random() * 5) + 3,
            pendingCases: Math.floor(Math.random() * 3) + 1,
            processingCases: Math.floor(Math.random() * 3) + 1,
            resolvedCases: Math.floor(Math.random() * 3) + 1,
            criticalCases: Math.floor(Math.random() * 2),
        });
    }

    return data;
};

const mockTimeSeriesData = generateTimeSeriesData();

// ===== API 函數 =====

export const mockApi = {
    // ===== 認證相關 =====
    login: async (username: string): Promise<User | null> => {
        await delay(800);
        if (username === 'admin') {
            return mockUsers.find(u => u.id === 'u1') || null;
        }
        if (username === 'caseworker') {
            return mockUsers.find(u => u.id === 'u2') || null;
        }
        if (username === 'supervisor') {
            return mockUsers.find(u => u.id === 'u3') || null;
        }
        return null;
    },

    // ===== 公開 API =====
    getNews: async () => {
        await delay(300);
        return [
            { id: 1, title: '颱風期間請注意戶外招牌與盆栽', date: '2026-01-01', urgent: true },
            { id: 2, title: '狂犬病疫苗巡迴施打時程表', date: '2025-12-28', urgent: false },
            { id: 3, title: '新北市動保處愛心認養活動', date: '2025-12-25', urgent: false },
        ];
    },

    createCase: async (data: any): Promise<string> => {
        await delay(1500);
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
        const caseId = `C${dateStr}-${random}`;
        console.log('[MockAPI] Case Created:', caseId, data);
        return caseId;
    },

    // ===== 案件管理 =====
    getCases: async (filters?: any): Promise<Case[]> => {
        await delay(600);
        let result = [...mockCases];
        if (filters?.status) {
            result = result.filter(c => c.status === filters.status);
        }
        if (filters?.type) {
            result = result.filter(c => c.type === filters.type);
        }
        if (filters?.priority) {
            result = result.filter(c => c.priority === filters.priority);
        }
        return result;
    },

    getCaseById: async (id: string): Promise<Case | null> => {
        await delay(300);
        return mockCases.find(c => c.id === id) || null;
    },

    updateCase: async (id: string, data: Partial<Case>): Promise<boolean> => {
        await delay(800);
        const caseIndex = mockCases.findIndex(c => c.id === id);
        if (caseIndex !== -1) {
            mockCases[caseIndex] = { ...mockCases[caseIndex], ...data, updatedAt: new Date().toISOString() };
            return true;
        }
        return false;
    },

    assignCase: async (caseId: string, userId: string): Promise<boolean> => {
        await delay(600);
        const caseIndex = mockCases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            mockCases[caseIndex] = { ...mockCases[caseIndex], assignedTo: userId, status: 'assigned' as const, updatedAt: new Date().toISOString() };
            return true;
        }
        return false;
    },

    // ===== 用戶管理 =====
    getUsers: async (filters?: any): Promise<User[]> => {
        await delay(400);
        let result = [...mockUsers];
        if (filters?.role) {
            result = result.filter(u => u.role === filters.role);
        }
        if (filters?.status) {
            result = result.filter(u => u.status === filters.status);
        }
        return result;
    },

    getUserById: async (id: string): Promise<User | null> => {
        await delay(300);
        return mockUsers.find(u => u.id === id) || null;
    },

    createUser: async (data: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
        await delay(800);
        const newUser: User = {
            ...data,
            id: `u${mockUsers.length + 1}`,
            createdAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
        return newUser.id;
    },

    updateUser: async (id: string, data: Partial<User>): Promise<boolean> => {
        await delay(600);
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
            return true;
        }
        return false;
    },

    // ===== 角色與權限 =====
    getRoles: async (): Promise<Role[]> => {
        await delay(300);
        return mockRoles;
    },

    getPermissions: async (): Promise<Permission[]> => {
        await delay(300);
        return mockPermissions;
    },

    // ===== 工作流程 =====
    getWorkflows: async (): Promise<Workflow[]> => {
        await delay(400);
        return mockWorkflows;
    },

    getWorkflowById: async (id: string): Promise<Workflow | null> => {
        await delay(300);
        return mockWorkflows.find(w => w.id === id) || null;
    },

    // ===== 代理人 =====
    getProxies: async (): Promise<ProxyAssignment[]> => {
        await delay(300);
        return mockProxies;
    },

    // ===== 審計日誌 =====
    getAuditLogs: async (filters?: any): Promise<AuditLog[]> => {
        await delay(500);
        let result = [...mockAuditLogs];
        if (filters?.userId) {
            result = result.filter(a => a.userId === filters.userId);
        }
        if (filters?.resource) {
            result = result.filter(a => a.resource === filters.resource);
        }
        return result;
    },

    // ===== 系統設定 =====
    getSystemConfig: async (): Promise<SystemConfig[]> => {
        await delay(400);
        return mockSystemConfig;
    },

    // ===== 介接設定 =====
    getIntegrations: async (): Promise<IntegrationConfig[]> => {
        await delay(400);
        return mockIntegrations;
    },

    // ===== 儀表板數據 =====
    getDashboardStats: async () => {
        await delay(800);
        return {
            totalCases: mockCases.length,
            pendingCases: mockCases.filter(c => c.status === 'pending').length,
            processingCases: mockCases.filter(c => c.status === 'processing').length,
            resolvedCases: mockCases.filter(c => c.status === 'resolved').length,
            criticalCases: mockCases.filter(c => c.priority === 'critical').length,
            totalUsers: mockUsers.length,
            activeUsers: mockUsers.filter(u => u.status === 'active').length,
        };
    },

    // 時間序列統計
    getDashboardTimeSeries: async (dateRange?: { start: string; end: string }) => {
        await delay(400);
        if (dateRange) {
            return mockTimeSeriesData.filter(
                d => d.date >= dateRange.start && d.date <= dateRange.end
            );
        }
        return mockTimeSeriesData;
    },

    // 案件類型統計
    getCaseTypeDistribution: async () => {
        await delay(300);
        const general = mockCases.filter(c => c.type === 'general').length;
        const bee = mockCases.filter(c => c.type === 'bee').length;

        return [
            { name: '一般案件', value: general, color: '#3b82f6' },
            { name: '蜂蛇案件', value: bee, color: '#f59e0b' },
        ];
    },

    // 案件優先級統計
    getCasePriorityDistribution: async () => {
        await delay(300);
        return [
            {
                name: '最緊急',
                value: mockCases.filter(c => c.priority === 'critical').length,
                color: '#ef4444'
            },
            {
                name: '高',
                value: mockCases.filter(c => c.priority === 'high').length,
                color: '#f59e0b'
            },
            {
                name: '普通',
                value: mockCases.filter(c => c.priority === 'medium').length,
                color: '#3b82f6'
            },
            {
                name: '低',
                value: mockCases.filter(c => c.priority === 'low').length,
                color: '#6b7280'
            },
        ];
    },

    // 承辦人工作量統計
    getCasesByAssignee: async () => {
        await delay(300);
        const assigneeCounts: Record<string, number> = {};

        mockCases.forEach(c => {
            if (c.assignedTo) {
                assigneeCounts[c.assignedTo] = (assigneeCounts[c.assignedTo] || 0) + 1;
            }
        });

        return Object.entries(assigneeCounts).map(([userId, count]) => {
            const user = mockUsers.find(u => u.id === userId);
            return {
                name: user?.name || userId,
                cases: count,
            };
        });
    },

    // 每週統計（最近 4 週）
    getWeeklyStats: async () => {
        await delay(400);
        return [
            { week: '第 1 週', totalCases: 8, resolved: 5, pending: 3 },
            { week: '第 2 週', totalCases: 12, resolved: 8, pending: 4 },
            { week: '第 3 週', totalCases: 15, resolved: 11, pending: 4 },
            { week: '第 4 週', totalCases: 13, resolved: 9, pending: 4 },
        ];
    },

    // 按工作流程階段分組案件
    getCasesByWorkflowStage: async (stage: CaseWorkflowStage) => {
        await delay(300);
        return mockCases.filter(c => c.workflowStage === stage);
    },

    // 工作流程菜單項目（帶未處理計數）
    getWorkflowMenuItems: async () => {
        await delay(400);
        const stages: CaseWorkflowStage[] = ['receipt', 'assignment', 'undertaker', 'public'];
        const menuItems: Record<string, { items: Case[], label: string, unresolvedCount: number }> = {};

        stages.forEach(stage => {
            const items = mockCases.filter(c => c.workflowStage === stage);
            const unresolvedCount = items.filter(c =>
                c.status !== 'resolved' && c.status !== 'rejected' && c.status !== 'archived'
            ).length;

            const stageLabels: Record<CaseWorkflowStage, string> = {
                'receipt': '收簽',
                'assignment': '分派',
                'undertaker': '承辦',
                'public': '公文'
            };

            menuItems[stage] = {
                items,
                label: stageLabels[stage],
                unresolvedCount
            };
        });

        return menuItems;
    },

    // 獲取未處理計數統計
    getUnresolvedCounts: async () => {
        await delay(300);
        const stages: CaseWorkflowStage[] = ['receipt', 'assignment', 'undertaker', 'public'];
        const counts: Record<string, number> = {};

        stages.forEach(stage => {
            const items = mockCases.filter(c => c.workflowStage === stage);
            counts[stage] = items.filter(c =>
                c.status !== 'resolved' && c.status !== 'rejected' && c.status !== 'archived'
            ).length;
        });

        return counts;
    },

    // 獲取詳細的案件菜單項目（按狀態和優先級分組）
    getDetailedCaseMenu: async () => {
        await delay(400);
        const menuItems: Record<string, { items: Case[]; count: number }> = {};

        // 定義詳細的菜單項目
        const menuDefinitions = [
            { key: 'all', label: '全部案件', filter: () => true },
            { key: 'attention', label: '關注案件', filter: (c: Case) => c.priority === 'critical' },

            // 收簽階段
            { key: 'receipt_pending', label: '收簽-待簽收', filter: (c: Case) => c.workflowStage === 'receipt' && c.status === 'pending' },
            { key: 'receipt_authorized', label: '收簽-已授理', filter: (c: Case) => c.workflowStage === 'receipt' && c.status === 'authorized' },

            // 分派階段
            { key: 'assignment_assigned', label: '分派-已分派', filter: (c: Case) => c.workflowStage === 'assignment' && c.status === 'assigned' },

            // 承辦階段
            { key: 'undertaker_pending', label: '承辦-待簽收', filter: (c: Case) => c.workflowStage === 'undertaker' && c.status === 'assigned' },
            { key: 'undertaker_processing', label: '承辦-處理中', filter: (c: Case) => c.workflowStage === 'undertaker' && c.status === 'processing' },
            { key: 'undertaker_transferred', label: '承辦-轉移中', filter: (c: Case) => c.workflowStage === 'undertaker' && c.status === 'transferred' },
            { key: 'undertaker_overdue', label: '承辦-超期', filter: (c: Case) => c.workflowStage === 'undertaker' && c.status === 'overdue' },

            // 公文階段
            { key: 'public_completed', label: '公文-待審核', filter: (c: Case) => c.workflowStage === 'public' && c.status === 'completed' },

            // 結案
            { key: 'resolved', label: '已結案', filter: (c: Case) => c.status === 'resolved' },
            { key: 'rejected', label: '責撤', filter: (c: Case) => c.status === 'rejected' },
        ];

        menuDefinitions.forEach(def => {
            const items = mockCases.filter(def.filter);
            menuItems[def.key] = {
                items,
                count: items.length
            };
        });

        return menuItems;
    },

    // ===== 報表 =====
    generateReport: async (type: string, filters?: any) => {
        await delay(1200);
        return {
            id: `R${Date.now()}`,
            type,
            generatedAt: new Date().toISOString(),
            data: mockCases.filter(c => !filters || Object.entries(filters).every(([k, v]) => (c as any)[k] === v)),
        };
    },
};
