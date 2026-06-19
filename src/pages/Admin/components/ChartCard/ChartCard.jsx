import React from 'react';
import '../../styles/cards.css';

function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">{title}</div>
          {subtitle && <div className="chart-card-subtitle">{subtitle}</div>}
        </div>
        {action && action}
      </div>
      <div className="chart-card-body">
        {children}
      </div>
    </div>
  );
}

/* ── Bar Chart ── */
export function BarChart({ data, labels, color = '#6366f1' }) {
  const maxVal = Math.max(...data);

  return (
    <div className="chart-bars">
      {data.map((value, i) => {
        const pct = Math.round((value / maxVal) * 100);
        return (
          <div className="chart-bar-item" key={i}>
            <div
              className="chart-bar"
              style={{
                background: `linear-gradient(180deg, ${color}, ${color}88)`,
                height: `${pct}%`,
              }}
              role="img"
              aria-label={`${labels[i]}: ${value}`}
              title={`${labels[i]}: ${value}`}
            />
            <span className="chart-bar-label">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Doughnut Chart ── */
export function DoughnutChart({ items, centerLabel, centerValue }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const gradientStops = items.map((item) => {
    const start = cumulativePercent;
    cumulativePercent += (item.value / total) * 100;
    return `${item.color} ${start}% ${cumulativePercent}%`;
  });

  return (
    <div>
      <div
        className="chart-doughnut"
        style={{ background: `conic-gradient(${gradientStops.join(', ')})` }}
        role="img"
        aria-label="Doughnut chart"
      >
        <div className="chart-doughnut-center">
          <span>{centerValue || total}</span>
          <span>{centerLabel || 'Total'}</span>
        </div>
      </div>
      <div className="chart-legend">
        {items.map((item, i) => (
          <div className="chart-legend-item" key={i}>
            <span className="chart-legend-dot" style={{ background: item.color }} />
            <span>{item.label} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Area/Line Chart ── */
export function AreaChart({ data, labels, color = '#22d3ee' }) {
  const maxVal = Math.max(...data);

  return (
    <div className="chart-line-container">
      {data.map((value, i) => {
        const pct = Math.round((value / maxVal) * 100);
        return (
          <div className="chart-line-point" key={i}>
            <div
              className="chart-line-fill"
              style={{
                background: `linear-gradient(180deg, ${color}cc, ${color}22)`,
                height: `${pct}%`,
              }}
              title={`${labels[i]}: ${value}`}
            >
              <div className="chart-line-dot" style={{ background: color }} />
            </div>
            <span className="chart-bar-label">{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ChartCard;
