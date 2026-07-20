import { useState, useMemo } from 'react';
import { Columns3, Download, Eye, FileSpreadsheet, FileText, Pencil, Printer, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const tone = key.includes('active') || key.includes('approved') || key.includes('success') || key.includes('fresh') || key.includes('completed')
    ? 'green'
    : key.includes('pending') || key.includes('aging') || key.includes('running') || key.includes('in review') || key.includes('in progress')
      ? 'amber'
      : key.includes('reject') || key.includes('failed') || key.includes('stale') || key.includes('critical') || key.includes('denied')
        ? 'red'
        : 'blue';
  return <span className={`pill pill-${tone}`}>{value}</span>;
}

export function PriorityPill({ value }) {
  const tones = { P1: 'red', P2: 'amber', P3: 'amber', P4: 'amber', P5: 'blue', P6: 'indigo', P7: 'indigo' };
  return <span className={`pill pill-${tones[value] || 'indigo'}`}>{value}</span>;
}

export function ProgressCell({ value }) {
  const val = parseInt(value, 10) || 0;
  return (
    <div className="cell-progress">
      <div className="progress-track"><div className="progress-fill" style={{ width: `${val}%` }} /></div>
      <strong className="tabular">{val}%</strong>
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
        <button className="action-btn view" title="View Details"><Eye size={14} /></button>
        <button className="action-btn edit" title="Edit Record"><Pencil size={14} /></button>
        <button className="action-btn delete" title="Delete Record"><Trash2 size={14} /></button>
      </div>
    );
  }
  return value === null || value === undefined || value === '' ? <span className="muted-dash">-</span> : value;
}

/**
 * High-fidelity Data Table following industry-standard patterns for Healthcare RCM.
 * Supports client-side filtering and pagination for dummy data interaction.
 */
export function DataTable({ title, columns, rows, filteredText, totalText, compact = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const lowerSearch = searchTerm.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [rows, searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const displayFiltered = filteredText || filteredRows.length.toLocaleString();
  const displayTotal = totalText || (rows.length * 8.4).toFixed(0).toLocaleString();

  return (
    <div className={`datatable-card ${compact ? 'compact' : ''}`}>
      {title && (
        <div className="datatable-title">
          <div className="title-left">
            <h3>{title}</h3>
            <span className="badge-count">{filteredRows.length} results</span>
          </div>
          <div className="title-actions">
             <button className="ghost-button sm"><Download size={13} /> Export Results</button>
          </div>
        </div>
      )}
      <div className="datatable-toolbar">
        <div className="datatable-left">
          <div className="entries-selector">
            <span>Show</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="divider-v" />
          <div className="export-group">
            {exportButtons.map(({ label, icon: Icon }) => (
              <button className="toolbar-button" key={label} title={`Export to ${label}`}><Icon size={14} /> {label}</button>
            ))}
          </div>
        </div>
        <div className="datatable-right">
          <label className="datatable-search">
            <Search size={15} />
            <input 
              placeholder="Filter these results..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </label>
        </div>
      </div>

      <div className="table-scroll">
        <table className="industry-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`${column.numeric ? 'numeric' : ''} ${column.key === 'actions' ? 'actions-head' : ''}`}>
                  <div className="th-content">
                    <span>{column.label}</span>
                    {column.key !== 'actions' && <span className="sort-icons">↕</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <Search size={32} className="muted" />
                    <p>No results match your criteria.</p>
                    {searchTerm && <button className="primary-button sm" onClick={() => setSearchTerm('')}>Reset Search</button>}
                  </div>
                </td>
              </tr>
            ) : paginatedRows.map((row, rowIndex) => (
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
        <div className="footer-info">
          Showing {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredRows.length)} of <strong>{displayFiltered}</strong> entries
          <span className="total-context"> (from {displayTotal} records)</span>
        </div>
        <div className="pagination-group">
          <button 
            className="page-nav" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>
          <button className="page-num active">{currentPage}</button>
          {totalPages > 1 && currentPage < totalPages && <button className="page-num" onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</button>}
          {totalPages > 2 && currentPage < totalPages - 1 && <span className="page-sep">...</span>}
          {totalPages > currentPage + 1 && <button className="page-num" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>}
          <button 
            className="page-nav" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
