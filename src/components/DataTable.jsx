import { Columns3, Download, Eye, FileSpreadsheet, FileText, Pencil, Printer, Search, Trash2 } from 'lucide-react';
import './DataTable.css';

const exportButtons = [
  { label: 'Excel', icon: FileSpreadsheet },
  { label: 'CSV', icon: Download },
  { label: 'PDF', icon: FileText },
  { label: 'Print', icon: Printer },
  { label: 'Columns', icon: Columns3 },
];

export function StatusPill({ value }) {
  const key = String(value).toLowerCase();
  const tone = key.includes('active') || key.includes('approved') || key.includes('success') || key.includes('fresh')
    ? 'green'
    : key.includes('pending') || key.includes('aging') || key.includes('running')
      ? 'amber'
      : key.includes('reject') || key.includes('failed') || key.includes('stale') || key.includes('critical')
        ? 'red'
        : 'blue';
  return <span className={`pill pill-${tone}`}>{value}</span>;
}

export function PriorityPill({ value }) {
  const tones = { P1: 'red', P2: 'amber', P3: 'amber', P4: 'amber', P5: 'blue', P6: 'indigo', P7: 'indigo' };
  return <span className={`pill pill-${tones[value] || 'indigo'}`}>{value}</span>;
}

export function ProgressCell({ value }) {
  return (
    <div className="cell-progress">
      <div className="progress-track"><div className="progress-fill" style={{ width: `${value}%` }} /></div>
      <strong>{value}%</strong>
    </div>
  );
}

function renderCell(column, row) {
  const value = row[column.key];
  if (column.render) return column.render(value, row);
  if (column.type === 'status') return <StatusPill value={value} />;
  if (column.type === 'priority') return <PriorityPill value={value} />;
  if (column.type === 'progress') return <ProgressCell value={value} />;
  if (column.key === 'actions') {
    return (
      <div className="row-actions">
        <button title="View"><Eye size={14} /></button>
        <button title="Edit"><Pencil size={14} /></button>
        <button title="Delete"><Trash2 size={14} /></button>
      </div>
    );
  }
  return value;
}

export function DataTable({ title, columns, rows, filteredText = '4,283', totalText = '12,847', compact = false }) {
  return (
    <div className={`datatable-card ${compact ? 'compact' : ''}`}>
      {title && (
        <div className="datatable-title">
          <h3>{title}</h3>
        </div>
      )}
      <div className="datatable-toolbar">
        <div className="datatable-left">
          <span>Show</span>
          <select defaultValue="10"><option>10</option><option>25</option><option>50</option><option>100</option></select>
          <span>entries</span>
          {exportButtons.map(({ label, icon: Icon }) => (
            <button className="toolbar-button" key={label}><Icon size={14} /> {label}</button>
          ))}
        </div>
        <label className="datatable-search">
          <Search size={15} />
          <input placeholder="Search records..." />
        </label>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column.numeric ? 'numeric' : ''}>
                  <span>{column.label}</span>
                  <span className="sort">▲▼</span>
                </th>
              ))}
            </tr>
            <tr className="filter-head">
              {columns.map((column) => (
                <th key={`${column.key}-filter`} className={column.numeric ? 'numeric' : ''}>
                  {column.filter === 'select' ? <select><option>All</option></select> : <input placeholder="Search" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length}><div className="empty-state">No records found <button>Clear Filters</button></div></td></tr>
            ) : rows.map((row, rowIndex) => (
              <tr key={row.id || row.code || row.enc || rowIndex}>
                {columns.map((column) => (
                  <td key={column.key} className={column.numeric ? 'numeric tabular' : ''}>
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="datatable-footer">
        <span>Showing 1 to {Math.min(10, rows.length)} of {filteredText} entries (filtered from {totalText} total)</span>
        <div className="pagination">
          <button>« Prev</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <span>...</span>
          <button>429</button>
          <button>Next »</button>
        </div>
      </div>
    </div>
  );
}
