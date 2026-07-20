import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shell } from './components/Shell.jsx';
import { RouteElement } from './modules/moduleRegistry.jsx';
import { getAllModuleRoutes } from './routes/menuRoutes.js';
import './styles/global.css';

const routes = getAllModuleRoutes();

function App() {
  const { pathname } = useLocation();
  const currentRoute = routes.find((r) => r.path === pathname);

  useEffect(() => {
    // Update document title to match industry level branding
    if (currentRoute) {
      document.title = `${currentRoute.title} | A$cent Health Admin`;
    } else if (pathname === '/') {
      document.title = 'Dashboard | A$cent Health Admin';
    } else {
      document.title = 'A$cent Health Admin';
    }
  }, [currentRoute, pathname]);

  return (
    <Shell>
      <main className="content">
        {currentRoute ? (
          <RouteElement route={currentRoute} />
        ) : (
          <div className="empty-page-state">
            <h1 className="page-title">Welcome to A$cent Health Admin Panel</h1>
            <p>Industry-leading Revenue Cycle Management and AR Analytics system.</p>
            <div className="card" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}>
              <p className="muted">Select a module from the sidebar or top navigation to begin managing your RCM operations.</p>
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}

export default App;
