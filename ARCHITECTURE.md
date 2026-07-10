# DayClaim.ai Admin Panel — Architecture

A React admin panel (Vite + React Router) that renders ~200
revenue-cycle-management modules from mock data. Login is real — it
authenticates against the DayClaim AR backend (separate repo:
`DayclaimsBackendCore`) over `VITE_API_BASE_URL` — but every module's
"save", "approve", or "assign" action beyond auth is still a visual mock
against static data. Keep that in mind when reading the security section
below.

## Layers

```
main.jsx
  └─ App.jsx            BrowserRouter, AuthProvider, route table
       ├─ /login         LoginPage (public)
       └─ /* (module)     ProtectedRoute → Shell (sidebar layout) → module page
```

### 1. Shell (`src/components/Shell.jsx`)

The app has no top bar. Navigation lives in a single left **sidebar**:

- Header: brand + collapse toggle (desktop) / close button (mobile).
- Search box that filters the nav tree by group or item label.
- Scrollable nav tree, generated from `src/data/adminData.js` `menuGroups`
  (accordion groups, or a direct link for single-page modules).
- Footer: notifications icon, current user, logout.

On viewports under 980px the sidebar becomes an off-canvas drawer opened by a
floating menu button; on desktop it can be collapsed to an icon rail. Each
module page renders its own header/title/filters (see `ModulePage.jsx` and
`AdminDashboard.jsx`), so the app has no shared top bar to keep in sync across
190+ pages.

### 2. Routing (`src/routes/menuRoutes.js`, `src/App.jsx`)

Routes are derived from `menuGroups`, not hand-written: each group/item pair
is slugified into a path (`/masters/client-master`). `App.jsx` maps that list
to `<Route>` elements, each wrapped in:

```
ProtectedRoute → Shell → ModuleErrorBoundary → Suspense → RouteElement
```

- **ProtectedRoute** redirects to `/login` if there's no session.
- **ModuleErrorBoundary** isolates a crash to the one module that threw —
  the sidebar and the rest of the app keep working.
- **Suspense** shows a lightweight loading state while a module's chunk
  downloads.

### 3. Module registry (`src/modules/moduleRegistry.jsx`)

Two kinds of modules:

- **Generated modules** — `src/modules/generated/<group>/<module>/`, each
  with a tiny `module.config.js` (title/group/path) and an `index.jsx`. New
  modules are added by dropping in a new folder; nothing else needs to change.
- **Special/hand-built pages** — the dashboard analytics pages in
  `src/pages/AdminDashboard.jsx` (charts, KPIs, tables with real mock data
  instead of the generic table).

`module.config.js` files are imported eagerly (they're a few bytes each) to
build the path → component map synchronously for the router. The matching
`index.jsx` is loaded with `React.lazy`, so **each module is its own code
chunk** — visiting one module never downloads the code for the other ~190.
This is the "separate per module" architecture: every module is an
independently buildable, independently loadable, independently failing unit.

### 4. Data layer

Everything is mock data (`src/data/adminData.js`, `ModulePage.jsx`'s
generators). There is no API client, no network calls, and no persistence
beyond `sessionStorage` for the login session. Swapping in a real backend
means adding a data-fetching layer behind these same module boundaries —
the module registry and routing do not need to change.

## Security model

This is a UI shell, so "security" here means what a static SPA can actually
enforce, plus what to add before this becomes a real product:

**What's implemented:**
- `AuthContext` (`src/modules/auth/AuthContext.jsx`) gates the app behind a
  session stored in `sessionStorage` (cleared on tab close / logout).
- `ProtectedRoute` blocks direct navigation to any module URL without a
  session and redirects back to `/login`, then returns the user to the page
  they asked for after login.
- Login calls the real backend (`POST /api/v1/auth/login`); the JWT
  access/refresh tokens it returns are stored in `sessionStorage` alongside
  the session. A failed login (wrong password, locked account, unreachable
  API) shows the backend's actual error message.
- Baseline HTTP security headers on the static deploy (`render.yaml`):
  `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, and a `Content-Security-Policy` restricted to
  same-origin script/style/font sources.
- `ModuleErrorBoundary` prevents one broken module from taking down the
  whole session (availability, not confidentiality/integrity, but still a
  security property).

**What this repo does NOT provide, and a real deployment must add:**
- Role-based *menu/route* filtering. `menuGroups` / routes are the same for
  every logged-in user regardless of their backend role — the backend
  enforces RBAC on its own endpoints (see DayclaimsBackendCore's
  `docs/SECURITY.md`), but this frontend doesn't yet hide/show modules based
  on the roles returned at login, and none of the ~200 mock modules actually
  call the backend for their data yet (only auth is wired up).
- Access-token refresh. The backend issues a 15-minute access token plus a
  rotating refresh token, but this frontend doesn't yet call
  `/api/v1/auth/refresh` before the access token expires — a long-idle
  session's stored token will simply go stale.
- CSRF/XSS protections for real forms, input validation/sanitization for
  anything that becomes a real write path, and HTTPS/HSTS at the edge
  (Render terminates TLS, but confirm HSTS is enabled for the domain).
- Audit logging, rate limiting, and secrets management — none of that
  applies yet because there's no backend to secure.

## Adding a new module

1. Create `src/modules/generated/<group>/<slug>/module.config.js` exporting
   `{ title, group, path, type: 'module' }`.
2. Create the matching `index.jsx` default-exporting a component (or reuse
   `ModulePage` for the generic table+filters layout).
3. Add the item label to the matching group in `src/data/adminData.js`'s
   `menuGroups` so it shows up in the sidebar and routing — `path` in
   `module.config.js` must match the slug the router derives from that label.
