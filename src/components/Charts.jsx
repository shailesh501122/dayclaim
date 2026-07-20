import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { colors, months } from '../data/adminData.js';

/**
 * Common Info Icon for StatCards and Charts.
 */
export function InfoIcon() {
  return <span className="card-info" title="More information">i</span>;
}

/**
 * Premium StatCard with sparkline for RCM metrics.
 */
export function StatCard({ label, value, delta, tone = 'green', spark }) {
  const sparkData = (spark || [4, 7, 5, 9, 8, 11]).map((v, i) => ({ name: i, v }));
  return (
    <div className="card stat-card">
      <InfoIcon />
      <div className="label">{label}</div>
      <div className="kpi-number tabular">{value}</div>
      {delta && <span className={`pill pill-${tone}`}>{delta}</span>}
      <div className="spark-container" style={{ height: 42, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <Area 
              dataKey="v" 
              stroke={tone === 'red' ? '#F04438' : colors.primary} 
              fill={tone === 'red' ? '#FEE4E2' : '#E8E4FF'} 
              strokeWidth={2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Donut Chart Card for distributions (Payer Mix, Speciality, etc.).
 */
export function DonutCard({ title, data }) {
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div style={{ height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={64} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || [colors.brand, colors.primary, colors.violet2, colors.violet3, colors.violet4][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        {data.map((item, index) => (
          <span className="pill pill-indigo" key={item.name || index}>
            <span className="legend-dot" style={{ background: item.fill || colors.brand }} /> {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Horizontal Bar Chart for ranked lists.
 */
export function HorizontalBars({ title, data, pivots = true }) {
  return (
    <div className="card horizontal-bars">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div className="hbar-list">
        {data.map((item, index) => (
          <div className="hbar" key={item.name || index}>
            <span>{item.name}</span>
            <div><i style={{ width: `${item.value}%` }} /></div>
          </div>
        ))}
      </div>
      {pivots && (
        <div className="pivot-stack">
          {['Payer', 'CPT', 'Provider', 'Facility'].map((pivot, index) => (
            <button className={index === 0 ? 'active' : ''} key={pivot}>{pivot}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Composed Chart for Production vs Target.
 */
export function ComboChart({ data }) {
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">Production vs Targets (Trend)</p>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="#ECECF5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="charges" name="Production" fill={colors.brand} radius={[5, 5, 0, 0]} />
            <Bar dataKey="payments" name="Collections" fill={colors.violet2} radius={[5, 5, 0, 0]} />
            <Line type="monotone" dataKey="collection" name="Target %" stroke={colors.teal} strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Simple Bar Chart for waterfall or age bucket views.
 */
export function SimpleBarChart({ title, data, xKey, bars }) {
  return (
    <div className="card">
      <InfoIcon />
      <p className="chart-title">{title}</p>
      <div style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#ECECF5" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {bars.map((bar, index) => (
              <Bar 
                key={bar} 
                dataKey={bar} 
                fill={[colors.brand, colors.primary, colors.teal][index % 3]} 
                radius={[5, 5, 0, 0]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
