import { useMemo, useState } from 'react';
import {
  Bell,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Database,
  FileBarChart,
  FileInput,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  PhoneCall,
  Radio,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserCog,
  Users,
  Workflow,
  X,
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext.jsx';
import { menuGroups } from '../data/adminData.js';
import { getRouteForMenu } from '../routes/menuRoutes.js';
import './Shell.css';

const parentMenuIcons = {
  Importer: FileInput,
  Reports: FileBarChart,
  Masters: Database,
  Other: BriefcaseBusiness,
  'Escalation Dashboard': ShieldCheck,
  'Role Management': UserCog,
  'Smart Search': Search,
  'Best Case': Star,
  'Call Center Analytics Dashboard': PhoneCall,
  'AI Assistance': Bot,
  Dashboard: LayoutDashboard,
  'Rule Engine': GitBranch,
  WFM: Workflow,
  'Knowledge Base': BookOpen,
  Notes: ClipboardList,
  'Live Allocation': Radio,
  'Payment Trend by Age': CreditCard,
  'DayClaim Reports': Sparkles,
  'ATB Reports': FileBarChart,
  'Client Reports': Users,
  'Manual Production': Network,
};

function ParentMenuIcon({ label }) {
  const Icon = parentMenuIcons[label] || LayoutDashboard;
  return <Icon className="nav-parent-icon" size={15} strokeWidth={2.2} />;
}

function matchesQuery(label, query) {
  return label.toLowerCase().includes(query.trim().toLowerCase());
}

function DesktopMenuContent({ group, onNavigate }) {
  if (group.mega) {
    return (
      <div className="dropdown-panel mega-menu">
        {group.columns.map((column, index) => (
          <div key={index} className="mega-column">
            {column.map((item) => (
              <NavLink key={item} onClick={onNavigate} to={getRouteForMenu(group, item)}>
                {item}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (group.flyout) {
    return (
      <div className="dropdown-panel flyout-menu">
        <div className="flyout-group">
          <strong>Master 1</strong>
          {group.columns[0].map((item) => (
            <NavLink key={item} onClick={onNavigate} to={getRouteForMenu(group, item)}>
              {item}
            </NavLink>
          ))}
        </div>
        <div className="flyout-group secondary">
          <strong>Master 2</strong>
          {group.columns[1].map((item) => (
            <NavLink key={item} onClick={onNavigate} to={getRouteForMenu(group, item)}>
              {item}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  if (!group.items) return null;

  return (
    <div className="dropdown-panel simple-menu">
      {group.items.map((item) => (
        <NavLink key={item} onClick={onNavigate} to={getRouteForMenu(group, item)}>
          {item}
        </NavLink>
      ))}
    </div>
  );
}

function MobileMenuGroup({ group, isOpen, onToggle, onNavigate }) {
  const items = group.columns ? group.columns.flat() : group.items || [];

  if (group.direct) {
    return (
      <NavLink className="mobile-nav-link" onClick={onNavigate} to={getRouteForMenu(group)}>
        <ParentMenuIcon label={group.label} />
        <span>{group.label}</span>
      </NavLink>
    );
  }

  return (
    <div className={`mobile-nav-group ${isOpen ? 'is-open' : ''}`}>
      <button className="mobile-nav-group-toggle" onClick={onToggle} type="button">
        <ParentMenuIcon label={group.label} />
        <span>{group.label}</span>
        <ChevronDown className="nav-caret" size={14} />
      </button>
      {isOpen && (
        <div className="mobile-nav-subnav">
          {items.map((item) => (
            <NavLink className="mobile-nav-sublink" key={item} onClick={onNavigate} to={getRouteForMenu(group, item)}>
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Shell({ children }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();
  const showFilterStrip = location.pathname.startsWith('/dashboard');

  const toggleMenu = (label, hasMenu) => {
    if (!hasMenu) {
      setOpenMenu(null);
      return;
    }
    setOpenMenu((current) => (current === label ? null : label));
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileOpenGroup(null);
  };

  const initials = useMemo(() => (user?.username || 'Admin').slice(0, 2).toUpperCase(), [user]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const results = [];
    menuGroups.forEach((group) => {
      if (group.direct) {
        if (matchesQuery(group.label, query)) {
          results.push({ label: group.label, group: null, to: getRouteForMenu(group) });
        }
        return;
      }
      const items = group.columns ? group.columns.flat() : group.items || [];
      items.forEach((item) => {
        if (matchesQuery(item, query)) {
          results.push({ label: item, group: group.label, to: getRouteForMenu(group, item) });
        }
      });
    });
    return results.slice(0, 10);
  }, [query]);

  return (
    <div className={`app ${showFilterStrip ? 'has-dashboard-filters' : 'no-dashboard-filters'}`}>
      <div className="app-header">
        <header className="topbar">
          <div className="topbar-inner">
            <Link className="brand" to="/dashboard/business-metrics">
              <span className="brand-mark">DC</span>
              <span className="brand-name">DayClaim.ai</span>
            </Link>

            <div className="topbar-search">
              <Search size={15} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search modules..."
                value={query}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((result) => (
                    <Link key={result.to} onClick={() => setQuery('')} to={result.to}>
                      <span className="search-result-label">{result.label}</span>
                      {result.group && <span className="search-result-group">{result.group}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="topbar-actions">
              <button className="top-icon" aria-label="Notifications" type="button">
                <Bell size={17} /><span>9</span>
              </button>
              <div className="user-chip">
                <span className="user-avatar">{initials}</span>
                <span className="user-name">{user?.username || 'Admin'}</span>
              </div>
              <button aria-label="Log out" className="top-icon" onClick={logout} type="button">
                <LogOut size={17} />
              </button>
              <button aria-label="Open menu" className="mobile-menu-toggle" onClick={() => setMobileOpen(true)} type="button">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        <nav className="menu-band" onMouseLeave={() => setOpenMenu(null)}>
          <div className="menu-inner">
            {menuGroups.map((group, index) => {
              const hasMenu = !group.direct && (group.items || group.columns);
              const isOpen = openMenu === group.label;
              const alignRight = index > menuGroups.length - 6;
              return (
                <div
                  className={`nav-item ${isOpen ? 'is-open' : ''} ${alignRight ? 'align-right' : ''}`}
                  key={group.label}
                  onMouseEnter={() => hasMenu && setOpenMenu(group.label)}
                >
                  {group.direct ? (
                    <NavLink className="nav-link" onClick={() => setOpenMenu(null)} to={getRouteForMenu(group)}>
                      <ParentMenuIcon label={group.label} />
                      <span>{group.label}</span>
                    </NavLink>
                  ) : (
                    <button
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      onClick={() => toggleMenu(group.label, hasMenu)}
                      type="button"
                    >
                      <ParentMenuIcon label={group.label} />
                      <span>{group.label}</span>
                      <ChevronDown className="nav-caret" size={13} />
                    </button>
                  )}
                  {isOpen && hasMenu && <DesktopMenuContent group={group} onNavigate={() => setOpenMenu(null)} />}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <button aria-label="Close menu" className="mobile-drawer-backdrop" onClick={closeMobile} type="button" />
      )}
      <aside className={`mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="brand-name">DayClaim.ai</span>
          <button aria-label="Close menu" onClick={closeMobile} type="button"><X size={20} /></button>
        </div>
        <nav className="mobile-drawer-nav">
          {menuGroups.map((group) => (
            <MobileMenuGroup
              group={group}
              isOpen={mobileOpenGroup === group.label}
              key={group.label}
              onNavigate={closeMobile}
              onToggle={() => setMobileOpenGroup((current) => (current === group.label ? null : group.label))}
            />
          ))}
        </nav>
        <div className="mobile-drawer-footer">
          <button onClick={logout} type="button"><LogOut size={16} /> Log out</button>
        </div>
      </aside>

      {showFilterStrip && <FilterStrip />}
      {children}
    </div>
  );
}

export function FilterStrip() {
  const filters = ['CBO', 'Sub Speciality', 'Office Key', 'Group Code', 'Group Name'];
  return (
    <section className="filter-strip">
      <div className="filter-row">
        {filters.map((filter) => (
          <button className="multi-select" key={filter}>
            <span>{filter}</span>
            <strong>None selected</strong>
            <ChevronDown size={14} />
          </button>
        ))}
        <button className="filter-clear" title="Clear filters"><SlidersHorizontal size={16} /></button>
        <div className="toggle-group">
          <button>YTD</button>
          <button className="active">MTD</button>
        </div>
      </div>
      <div className="date-row">
        <span className="label">Date filter</span>
        <input type="date" defaultValue="2026-03-01" />
        <input type="date" defaultValue="2026-03-28" />
        {['Today', 'WTD', 'MTD', 'QTD', 'YTD', 'Last 13 Months'].map((preset) => <button key={preset}>{preset}</button>)}
      </div>
    </section>
  );
}
