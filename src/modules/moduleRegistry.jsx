import { RealDashboard } from '../pages/RealDashboard.jsx';
import { RealImporterSetup } from '../pages/RealImporterSetup.jsx';
import { RealRuleEngine } from '../pages/RealRuleEngine.jsx';
import { RealScenarioMaster } from '../pages/RealScenarioMaster.jsx';
import { UserManagement } from '../pages/UserManagement.jsx';
import { ModulePage } from './shared/ModulePage.jsx';

// Every menu item now maps to a real, backend-connected screen — the ~190
// generated placeholder modules (fake data, no backend behind them) were
// removed from the menu and this registry. ModulePage below only remains as
// the not-found fallback, not as a dummy-data renderer for real routes.
const specialPages = {
  Dashboard: RealDashboard,
  'Rule Engine': RealRuleEngine,
  'Importer Setup': RealImporterSetup,
  'Scenario Master': RealScenarioMaster,
  'User Role Management': UserManagement,
  'Login Credentials': UserManagement,
};

export function RouteElement({ route }) {
  const Page = specialPages[route.title];
  if (Page) return <Page />;
  return <ModulePage title={route.title} group={route.group} />;
}
