
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/public/Home';
import { Report } from './pages/public/Report';
import { ReportSuccess } from './pages/public/ReportSuccess';
import { MapView } from './pages/public/MapView';
import { Status } from './pages/public/Status';
import { Resources } from './pages/public/Resources';
import { FAQ } from './pages/public/FAQ';
import { News } from './pages/public/News';
import { SmartGuide } from './pages/public/SmartGuide';
import { FieldworkReport } from './pages/public/FieldworkReport';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { CaseList } from './pages/admin/CaseList';
import { CaseDetail } from './pages/admin/CaseDetail';
import { UsersPage } from './pages/admin/Users';
import { RolesPage } from './pages/admin/Roles';
import { WorkflowsPage } from './pages/admin/Workflows';
import { ReportsPage } from './pages/admin/Reports';
import { SettingsPage } from './pages/admin/Settings';
import { IntegrationPage } from './pages/admin/Integration';
import { AuditLogsPage } from './pages/admin/AuditLogs';
import { ProxyPage } from './pages/admin/Proxy';
import { AnalyticsPage } from './pages/admin/Analytics';
import { GisAnalytics } from './pages/admin/GisAnalytics';

function App() {
  return (
    <BrowserRouter basename="/smart-service-platform">
      <ScrollToTop />
      <Routes>
        {/* 公開路由 */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/report/success" element={<Layout><ReportSuccess /></Layout>} />
        <Route path="/report/:type" element={<Layout><Report /></Layout>} />
        <Route path="/status" element={<Layout><Status /></Layout>} />
        <Route path="/map" element={<MapView />} />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="/news" element={<Layout><News /></Layout>} />
        <Route path="/smart-guide" element={<Layout><SmartGuide /></Layout>} />
        <Route path="/report/fieldwork/:caseId" element={<Layout><FieldworkReport /></Layout>} />

        {/* 登入 */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* 後台路由 - 使用 AdminLayout 作為容器 */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cases" element={<CaseList />} />
          <Route path="/admin/cases/:id" element={<CaseDetail />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/workflows" element={<WorkflowsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/integrations" element={<IntegrationPage />} />
          <Route path="/admin/proxy" element={<ProxyPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/gis" element={<GisAnalytics />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        {/* 重定向與錯誤處理 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
