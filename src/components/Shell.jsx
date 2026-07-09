import { useMemo, useState } from 'react';
import {
  Bell,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
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
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
  Radio,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserCog,
  UserRound,
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

function SidebarGroup({ group, query, isOpen, onToggle, onNavigate }) {
  const items = group.columns ? group.columns.flat() : group.items || [];

  if (group.direct) {
    if (query && !matchesQuery(group.label, query)) return null;
    return (
      <NavLink className="sidebar-link" onClick={onNavigate} to={getRouteForMenu(group)}>
        <ParentMenuIcon label={group.label} />
        <span className="sidebar-label">{group.label}</span>
      </NavLink>
    );
  }

  const filteredItems = query ? items.filter((item) => matchesQuery(item, query)) : items;
  if (query && filteredItems.length === 0 && !matchesQuery(group.label, query)) return null;
  const expanded = query ? true : isOpen;

  return (
    <div className={`sidebar-group ${expanded ? 'is-open' : ''}`}>
      <button
        aria-expanded={expanded}
        className="sidebar-group-toggle"
        onClick={onToggle}
        type="button"
      >
        <ParentMenuIcon label={group.label} />
        <span className="sidebar-label">{group.label}</span>
        <ChevronRight className="sidebar-caret" size={14} />
      </button>
      {expanded && (
        <div className="sidebar-subnav">
          {(query ? filteredItems : items).map((item) => (
            <NavLink className="sidebar-sublink" key={item} onClick={onNavigate} to={getRouteForMenu(group, item)}>
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Shell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const { user, logout } = useAuth();
  const showFilterStrip = location.pathname.startsWith('/dashboard');

  const closeMobile = () => setMobileOpen(false);

  const toggleGroup = (label) => {
    if (collapsed) setCollapsed(false);
    setOpenGroup((current) => (current === label ? null : label));
  };

  const initials = useMemo(() => {
    const name = user?.username || 'Admin';
    return name.slice(0, 2).toUpperCase();
  }, [user]);

  return (
    <div className={`app ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${showFilterStrip ? 'has-dashboard-filters' : 'no-dashboard-filters'}`}>
      {mobileOpen && <button aria-label="Close menu" className="sidebar-backdrop" onClick={closeMobile} type="button" />}

      <aside className={`sidebar ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link className="brand" onClick={closeMobile} to="/dashboard/business-metrics">
            <span className="brand-mark">DC</span>
            <span className="sidebar-label brand-name">DayClaim.ai</span>
          </Link>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="sidebar-collapse-toggle"
            onClick={() => setCollapsed((v) => !v)}
            type="button"
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
          <button aria-label="Close menu" className="sidebar-close" onClick={closeMobile} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={14} />
          <input
            className="sidebar-label"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search modules..."
            value={query}
          />
        </div>

        <nav className="sidebar-nav">
          {menuGroups.map((group) => (
            <SidebarGroup
              group={group}
              isOpen={openGroup === group.label}
              key={group.label}
              onNavigate={closeMobile}
              onToggle={() => toggleGroup(group.label)}
              query={query}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-icon-button" title="Notifications" type="button">
            <Bell size={16} /><span className="badge-dot">9</span>
          </button>
          <div className="sidebar-user">
            <span className="sidebar-avatar">{initials}</span>
            <div className="sidebar-label sidebar-user-info">
              <strong>{user?.username || 'Admin'}</strong>
              <small>Signed in</small>
            </div>
          </div>
          <button className="sidebar-icon-button" onClick={logout} title="Log out" type="button">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="app-main">
        <button aria-label="Open menu" className="mobile-menu-toggle" onClick={() => setMobileOpen(true)} type="button">
          <Menu size={18} />
        </button>
        {showFilterStrip && <FilterStrip />}
        {children}
      </div>
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
