import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !(user?.roles || []).some((role) => roles.includes(role))) {
    return (
      <div className="section" style={{ padding: '2rem' }}>
        <h2>Access restricted</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
