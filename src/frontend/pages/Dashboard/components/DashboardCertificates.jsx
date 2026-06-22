import React, { useState } from 'react';
import '../DashboardStyles.css';
import './DashboardCertificates.css';

const mockCerts = [
  { id: 1, title: 'Web Development Fundamentals', issuer: 'Solution Adda', date: 'Jun 20, 2026', emoji: '💻', color: '#00f2fe', id_num: 'SA-WD-2026-001' },
  { id: 2, title: 'JavaScript Mastery', issuer: 'Solution Adda', date: 'Jun 10, 2026', emoji: '⚡', color: '#fbbf24', id_num: 'SA-JS-2026-002' },
  { id: 3, title: 'React Developer', issuer: 'Solution Adda', date: 'May 28, 2026', emoji: '⚛️', color: '#a78bfa', id_num: 'SA-RX-2026-003' },
];

function CertCard({ cert, view }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cert.id_num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === 'list') {
    return (
      <div className="cert-list-item">
        <div className="cert-list-emoji" style={{ background: `${cert.color}15`, borderColor: `${cert.color}25` }}>
          {cert.emoji}
        </div>
        <div className="cert-list-info">
          <div className="cert-list-title">{cert.title}</div>
          <div className="cert-list-meta">{cert.issuer} · {cert.date} · ID: {cert.id_num}</div>
        </div>
        <div className="cert-list-actions">
          <button className="cert-action-btn" onClick={handleCopy} title="Copy ID">
            {copied ? '✅' : '📋'}
          </button>
          <button className="cert-action-btn" title="Download">⬇️</button>
          <button className="cert-action-btn" title="Share on LinkedIn">in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cert-card" style={{ '--cert-color': cert.color }}>
      {/* Certificate Design */}
      <div className="cert-card-preview" style={{ borderColor: `${cert.color}30` }}>
        <div className="cert-preview-top">
          <div className="cert-preview-logo">🎓 Solution Adda</div>
          <div className="cert-preview-text">Certificate of Completion</div>
        </div>
        <div className="cert-preview-emoji" style={{ color: cert.color }}>{cert.emoji}</div>
        <div className="cert-preview-title">{cert.title}</div>
        <div className="cert-preview-divider" style={{ background: cert.color }} />
        <div className="cert-preview-id">#{cert.id_num}</div>
      </div>

      {/* Actions */}
      <div className="cert-card-footer">
        <div className="cert-card-date">{cert.date}</div>
        <div className="cert-card-actions">
          <button className="cert-action-btn" onClick={handleCopy} title="Copy ID">
            {copied ? '✅' : '📋'}
          </button>
          <button className="cert-action-btn" title="Download">⬇️</button>
          <button className="cert-action-btn linkedin" title="Share on LinkedIn">in</button>
        </div>
      </div>
    </div>
  );
}

function DashboardCertificates({ enrolledCourses, completedSyllabusItems }) {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  // Determine actually completed courses (100%)
  const completedCourses = enrolledCourses.filter(c => {
    if (!c.syllabus?.length) return false;
    const done = c.syllabus.reduce((a, _, i) =>
      a + (completedSyllabusItems[`${c.title}-${i}`] ? 1 : 0), 0);
    return done === c.syllabus.length;
  });

  // Combine real completed + mock for demo
  const allCerts = [
    ...mockCerts,
    ...completedCourses.filter(c => !mockCerts.some(m => m.title.includes(c.title))).map((c, i) => ({
      id: 100 + i,
      title: c.title,
      issuer: 'Solution Adda',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: c.emoji,
      color: '#34d399',
      id_num: `SA-${c.title.slice(0,2).toUpperCase()}-2026-${String(100 + i).padStart(3, '0')}`,
    })),
  ];

  const filtered = allCerts.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dash-section dash-certificates">
      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">
            <span className="title-icon" style={{ background: 'rgba(52,211,153,0.12)' }}>🎖️</span>
            Certificates
          </h2>
          <p className="dash-section-subtitle">{allCerts.length} certificates earned</p>
        </div>
        <div className="cert-view-toggle">
          <button className={`cert-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞ Grid</button>
          <button className={`cert-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>☰ List</button>
        </div>
      </div>

      {/* Search */}
      <div className="courses-search-wrap" style={{ maxWidth: 360 }}>
        <span className="courses-search-icon">🔍</span>
        <input
          className="courses-search-input"
          type="text"
          placeholder="Search certificates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        view === 'grid' ? (
          <div className="cert-grid">
            {filtered.map(cert => <CertCard key={cert.id} cert={cert} view="grid" />)}
          </div>
        ) : (
          <div className="cert-list">
            {filtered.map(cert => <CertCard key={cert.id} cert={cert} view="list" />)}
          </div>
        )
      ) : (
        <div className="dash-empty">
          <div className="dash-empty-icon">🎖️</div>
          <h3>No certificates yet</h3>
          <p>Complete a course 100% to earn your certificate</p>
        </div>
      )}
    </div>
  );
}

export default DashboardCertificates;
