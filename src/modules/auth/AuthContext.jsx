import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest } from '../../api/authApi.js';
import { fetchMyMenuAccess } from '../../api/menuAccessApi.js';

const SESSION_KEY = 'dayclaim.session';
const AuthContext = createContext(null);

// localStorage (not sessionStorage) so a session started in one tab is
// visible to menu links opened in a new tab — sessionStorage is scoped
// per-tab by the browser and was causing an immediate logout there.
function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [menuAccess, setMenuAccess] = useState(null);
  const [menuAccessLoading, setMenuAccessLoading] = useState(Boolean(session));

  // Keep tabs in sync: logging out (or in) in one tab reflects in others too.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === SESSION_KEY) {
        setSession(readSession());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setMenuAccess(null);
      setMenuAccessLoading(false);
      return undefined;
    }
    setMenuAccessLoading(true);
    fetchMyMenuAccess()
      .then((result) => { if (!cancelled) setMenuAccess(result); })
      .catch(() => { if (!cancelled) setMenuAccess({ allowAll: false, allowedPaths: [] }); })
      .finally(() => { if (!cancelled) setMenuAccessLoading(false); });
    return () => { cancelled = true; };
  }, [session?.userId, session?.accessToken]);

  const value = useMemo(() => ({
    user: session,
    isAuthenticated: Boolean(session),
    menuAccess,
    menuAccessLoading,
    hasMenuAccess(path) {
      if (!menuAccess) return false;
      return menuAccess.allowAll || menuAccess.allowedPaths.includes(path);
    },
    async login(username, password) {
      const result = await loginRequest(username, password);
      const next = {
        username: result.displayName || username,
        userId: result.userId,
        roles: result.roles,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpiresAtUtc: result.accessTokenExpiresAtUtc,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
    },
    async logout() {
      await logoutRequest(session?.refreshToken);
      localStorage.removeItem(SESSION_KEY);
      setSession(null);
      setMenuAccess(null);
    },
  }), [session, menuAccess, menuAccessLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
