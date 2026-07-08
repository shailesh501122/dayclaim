import {
  AiJobs,
  AllocationDashboard,
  ArAnalytics,
  AssignmentApproval,
  BusinessMetrics,
  ClientMaster,
  EmployeeInfo,
  EscalationDashboard,
  ImporterUpload,
  InventoryOverview,
  KpiMetrics,
  ManualAssignment,
  NotificationsCenter,
  PaymentTrend,
  PerformanceDashboard,
  RoleAccess,
  RuleEngine,
  ScenarioMaster,
  UserRoleManagement,
} from '../pages/AdminDashboard.jsx';
import { ModulePage } from './shared/ModulePage.jsx';

const generatedModuleImports = import.meta.glob('./generated/**/index.jsx', { eager: true });

const generatedPages = Object.fromEntries(
  Object.values(generatedModuleImports)
    .filter((module) => module.routePath && module.default)
    .map((module) => [module.routePath, module.default]),
);

const specialPages = {
  'Business Metrics': BusinessMetrics,
  'KPI Metrics': KpiMetrics,
  'AR Analytics': ArAnalytics,
  'Payment Trend by Age': PaymentTrend,
  'Allocation Dashboard': AllocationDashboard,
  'Rule Engine Dashboard': RuleEngine,
  'Rule Engine': RuleEngine,
  'Performance Dashboard': PerformanceDashboard,
  'Escalation Dashboard': EscalationDashboard,
  'Inventory Overview': InventoryOverview,
  'Client Master': ClientMaster,
  'Employee Info': EmployeeInfo,
  'User Role Access': RoleAccess,
  'User Role Management': UserRoleManagement,
  'File Upload': ImporterUpload,
  'Manual Assignment': ManualAssignment,
  'Assignment Approval': AssignmentApproval,
  'Manual Assignment Approval': AssignmentApproval,
  'Scenario Master': ScenarioMaster,
  'Jobs Dashboard': AiJobs,
  'Notifications': NotificationsCenter,
};

export function RouteElement({ route }) {
  const Page = specialPages[route.title] || generatedPages[route.path];
  if (Page) return <Page />;
  return <ModulePage title={route.title} group={route.group} />;
}

export function getGeneratedModuleCount() {
  return Object.keys(generatedPages).length;
}
