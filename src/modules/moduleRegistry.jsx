import { lazy } from 'react';
import {
  AllocationDashboard,
  ArAnalytics,
  BusinessMetrics,
  EscalationDashboard,
  InventoryOverview,
  KpiMetrics,
  PaymentTrend,
  PerformanceDashboard,
  RuleEngine,
} from '../pages/AdminDashboard.jsx';
import { UserManagement } from '../pages/UserManagement.jsx';
import { ModulePage } from './shared/ModulePage.jsx';

// Config files are tiny and imported eagerly so route metadata (path/title/group)
// is available synchronously for building the router. The page components
// themselves (index.jsx) are loaded lazily, one chunk per module, so visiting
// one module never pulls in the code for the other ~190 generated modules.
const generatedConfigs = import.meta.glob('./generated/**/module.config.js', { eager: true });
const generatedLoaders = import.meta.glob('./generated/**/index.jsx');

const generatedPages = {};
Object.entries(generatedConfigs).forEach(([configPath, mod]) => {
  const config = mod.moduleConfig;
  if (!config?.path) return;
  const indexPath = configPath.replace(/module\.config\.js$/, 'index.jsx');
  const loader = generatedLoaders[indexPath];
  if (!loader) return;
  generatedPages[config.path] = lazy(() => loader());
});

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
  'User Role Management': UserManagement,
  'Login Credentials': UserManagement,
};

export function RouteElement({ route }) {
  const Page = specialPages[route.title] || generatedPages[route.path];
  if (Page) return <Page />;
  return <ModulePage title={route.title} group={route.group} />;
}

export function getGeneratedModuleCount() {
  return Object.keys(generatedPages).length;
}
