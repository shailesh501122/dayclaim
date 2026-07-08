import { useState } from 'react';
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
  Mail,
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
  UserRound,
  Users,
  Workflow,
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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

function MenuContent({ group, onNavigate }) {
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

export function Shell({ children }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const showFilterStrip = location.pathname.startsWith('/dashboard');

  const toggleMenu = (label, hasMenu) => {
    if (!hasMenu) {
      setOpenMenu(null);
      return;
    }
    setOpenMenu((current) => (current === label ? null : label));
  };

  return (
    <div className={`app ${showFilterStrip ? 'has-dashboard-filters' : 'no-dashboard-filters'}`}>
      <header className="topbar">
        <Link className="brand" to="/dashboard/business-metrics">DayClaim.ai</Link>
        <div className="topbar-actions">
          <button className="top-icon" aria-label="Notifications"><Bell size={17} /><span>9</span></button>
          <button className="top-icon" aria-label="Messages"><Mail size={17} /></button>
          <button className="admin-menu"><UserRound size={17} /> Welcome, Admin <ChevronDown size={14} /></button>
          <button className="top-icon" aria-label="Menu"><Menu size={18} /></button>
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
                {isOpen && hasMenu && <MenuContent group={group} onNavigate={() => setOpenMenu(null)} />}
              </div>
            );
          })}
        </div>
      </nav>

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
