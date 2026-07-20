import {
  Download,
  Filter,
  Plus,
  RefreshCcw,
  Save,
  Search,
} from 'lucide-react';
import { DataTable, ProgressCell } from '../components/DataTable.jsx';
import { StatCard, DonutCard, HorizontalBars, ComboChart, SimpleBarChart } from '../components/Charts.jsx';
import * as data from '../data/adminData.js';

/**
 * Categorize modules based on their title and group to determine layout patterns.
 */
function getModuleKind(group, title) {
  const text = `${group} ${title}`.toLowerCase();
  if (text.includes('master') || text.includes('setup') || text.includes('role management')) return 'master';
  if (text.includes('report') || text.includes('analytics') || text.includes('dashboard') || text.includes('trend') || text.includes('summary')) return 'report';
  if (text.includes('import') || text.includes('upload') || text.includes('batch')) return 'import';
  if (text.includes('assignment') || text.includes('allocation') || text.includes('wfm')) return 'worklist';
  return 'module';
}

/**
 * Fetch rows based on module title, fallback to generic generator.
 */
function getRows(title, kind) {
  if (data.reportDataMap[title]) return data.reportDataMap[title];
  
  const owners = ['Ananya Iyer', 'Rahul Menon', 'Priya S', 'Neha R', 'Vikram Rao', 'Amit K'];
  const clients = ['Austin Heart Group', 'NorthStar Ortho', 'Lakeside GI', 'Metro Urology'];
  const departments = ['AR', 'Appeal', 'Payment Posting', 'Coding', 'Patient Calling', 'Client', 'Adjustment'];

  return Array.from({ length: 15 }, (_, index) => {
    const amount = 8420 + index * 6187;
    const name = owners[index % owners.length];
    return {
      sr: index + 1,
      id: `${title.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'MOD')}-${2026}-${1040 + index}`,
      empId: 4800 + index * 73,
      lastName: name.split(' ')[1] || 'Kumar',
      firstName: name.split(' ')[0],
      gender: index % 3 === 0 ? 'F' : 'M',
      division: 'Operation',
      department: departments[index % departments.length],
      designation: ['Trainee - AR', 'Sr. Executive AR', 'Team Lead - Quality', 'Manager - Operations'][index % 4],
      role: ['User', 'Supervisor', 'Quality Manager', ''][index % 4],
      encounter: `ENC-2026-${104382 + index * 73}`,
      client: clients[index % clients.length],
      payer: ['UHC Choice Plus', 'BCBS of TX', 'Cigna Open Access', 'Aetna PPO'][index % 4],
      owner: name,
      jobDate: `2026-03-${String(28 - (index % 18)).padStart(2, '0')}`,
      balance: `$${amount.toLocaleString('en-US')}.00`,
      priority: `P${(index % 6) + 1}`,
      status: ['Active', 'Pending Approval', 'In Progress', 'Success', 'Review'][index % 5],
      age: ['0-30', '31-60', '61-90', '91-120', '120+'][index % 5],
      total: 48 + index * 7,
      efficiency: `${74 + (index % 18)}%`,
      updated: `2026-03-${String(28 - index).padStart(2, '0')}`,
      completion: 48 + index * 3,
      fileName: `${title.replace(/\s+/g, '_')}_${String(index + 1).padStart(2, '0')}.xlsx`,
      passed: (8400 + index * 122).toLocaleString('en-US'),
      failed: 12 + index * 3,
    };
  });
}

/**
 * Resolve columns for the module.
 */
function getColumns(title, kind) {
  const config = data.reportConfigs[title];
  if (config?.columns) return config.columns;

  if (kind === 'master') {
    return [
      { key: 'sr', label: 'SR.NO.', numeric: true },
      { key: 'empId', label: 'EMPID', numeric: true },
      { key: 'lastName', label: 'LAST NAME' },
      { key: 'firstName', label: 'FIRST NAME' },
      { key: 'gender', label: 'GENDER', filter: 'select' },
      { key: 'division', label: 'DIVISION', filter: 'select' },
      { key: 'department', label: 'DEPARTMENT', filter: 'select' },
      { key: 'designation', label: 'DESIGNATION' },
      { key: 'role', label: 'ROLE', filter: 'select' },
      { key: 'status', label: 'STATUS', type: 'status', filter: 'select' },
      { key: 'actions', label: 'ACTION' },
    ];
  }

  if (kind === 'report') {
    return [
      { key: 'sr', label: 'S.No.', numeric: true },
      { key: 'owner', label: 'Employee' },
      { key: 'empId', label: 'Employee Code', numeric: true },
      { key: 'client', label: 'Client' },
      { key: 'jobDate', label: 'JobDate' },
      { key: 'department', label: 'Department', filter: 'select' },
      { key: 'division', label: 'Division', filter: 'select' },
      { key: 'total', label: 'Total', numeric: true },
      { key: 'efficiency', label: 'Average Efficiency(%)', numeric: true },
      { key: 'actions', label: 'Action' },
    ];
  }

  return [
    { key: 'id', label: 'Record ID' },
    { key: 'encounter', label: 'Encounter #' },
    { key: 'client', label: 'Client' },
    { key: 'payer', label: 'Payer' },
    { key: 'owner', label: 'Owner' },
    { key: 'balance', label: 'Balance', numeric: true },
    { key: 'priority', label: 'Priority', type: 'priority', filter: 'select' },
    { key: 'status', label: 'Status', type: 'status', filter: 'select' },
    { key: 'updated', label: 'Updated' },
    { key: 'actions', label: 'Actions' },
  ];
}

/**
 * Filter and Control Panel with context-aware inputs.
 */
function ModuleControlPanel({ kind, title }) {
  const isMaster = kind === 'master';
  
  return (
    <div className="card module-control-card">
      <div className="module-control-title">
        <div>
          <strong>{title} {isMaster ? 'Setup' : 'Filters'}</strong>
          <span>{isMaster ? 'Manage system configurations and masters' : 'Refine data results with professional criteria'}</span>
        </div>
        <button className="primary-button">
          {isMaster ? <Save size={15} /> : <Search size={15} />}
          {' '}
          {isMaster ? 'Save' : 'Search'}
        </button>
      </div>
      <div className={`module-control-grid ${isMaster ? 'master-grid' : ''}`}>
        <label><span>Client</span><select><option>None selected</option><option>Austin Heart Group</option><option>NorthStar Ortho</option></select></label>
        {isMaster ? (
          <>
            <label><span>Status</span><select><option>Active</option><option>Inactive</option></select></label>
            <label><span>Search Term</span><input placeholder={`Find ${title}...`} /></label>
            <label><span>Config File</span><input type="file" /></label>
          </>
        ) : (
          <>
            <label><span>Payer Category</span><select><option>All</option><option>Commercial</option><option>Medicare</option><option>Medicaid</option></select></label>
            <label><span>Supervisor</span><select><option>None selected</option><option>Priya S</option><option>Rahul M</option></select></label>
            <label><span>Date Range</span><input type="date" defaultValue="2026-07-08" /></label>
          </>
        )}
      </div>
      {isMaster && <p className="module-note">Note: Updates to master records impact system-wide routing and reporting logic.</p>}
    </div>
  );
}

/**
 * Helper to render appropriate charts based on configuration.
 */
function AnalyticsRenderer({ type, title, dataKey, xKey, bars }) {
  const chartData = data[dataKey];
  if (!chartData) return null;

  switch (type) {
    case 'donut': return <DonutCard title={title} data={chartData} />;
    case 'bar': return <SimpleBarChart title={title} data={chartData} xKey={xKey} bars={bars} />;
    case 'combo': return <ComboChart data={chartData} />;
    case 'hbar': return <HorizontalBars title={title} data={chartData} pivots={false} />;
    default: return null;
  }
}

/**
 * Main Smart Module Page component.
 */
export function ModulePage({ title, group }) {
  const kind = getModuleKind(group, title);
  const rows = getRows(title, kind);
  const columns = getColumns(title, kind);
  const config = data.reportConfigs[title];

  const addLabel = kind === 'master' ? `New ${title.replace(/ Master$/i, '')}` : kind === 'report' ? 'Run Report' : 'Add Record';

  return (
    <section className="section module-page">
      <div className="module-hero">
        <div>
          <span className="module-kicker">{group}</span>
          <h1>{title}</h1>
          <p>Advanced AR management interface featuring industry-standard controls and high-fidelity analytics.</p>
        </div>
        <div className="module-actions">
          <button className="ghost-button"><RefreshCcw size={15} /> Refresh</button>
          <button className="ghost-button"><Download size={15} /> Export</button>
          <button className="primary-button"><Plus size={15} /> {addLabel}</button>
        </div>
      </div>

      <ModuleControlPanel kind={kind} title={title} />

      {config?.kpis && (
        <div className="grid grid-4 section">
          {config.kpis.map((kpi) => (
            <StatCard key={kpi.label} {...kpi} />
          ))}
        </div>
      )}

      {config?.charts && (
        <div className={`grid grid-${config.charts.length > 1 ? '2' : '1'} section`}>
          {config.charts.map((chart, idx) => (
            <AnalyticsRenderer key={idx} {...chart} />
          ))}
        </div>
      )}

      <div className="section">
        <DataTable 
          title={`${title} ${kind === 'report' ? 'Result' : 'List'}`} 
          columns={columns} 
          rows={rows} 
          filteredText={rows.length.toLocaleString()} 
          totalText={(rows.length * 12.4).toFixed(0).toLocaleString()} 
        />
      </div>
    </section>
  );
}
