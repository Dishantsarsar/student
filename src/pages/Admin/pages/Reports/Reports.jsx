import React, { useState } from 'react';
import {
  FileText, Users, BookOpen, GraduationCap, DollarSign,
  Star, Download, Sheet, File,
} from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import { reportCards, exportFormats } from '../../data/reports.js';
import '../../styles/cards.css';
import '../../styles/buttons.css';
import './Reports.css';
import CustomDialog from '../../../../components/CustomDialog/CustomDialog';

/* Named icon map — avoids wildcard import */
const ICON_MAP = {
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Star,
  Download,
  Sheet,
  File,
};

const FMT_ICONS = {
  Download,
  FileText,
  File,
  Sheet,
};

function Reports() {
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false });
  const handleExport = (reportId, format) => {
    setDialogConfig({
      isOpen: true,
      title: 'Export Started',
      message: `Exporting ${reportId} as ${format.toUpperCase()}. This is a mock action — backend integration required.`,
      type: 'success',
      confirmText: 'Done'
    });
  };

  return (
    <div className="admin-page-content">
      <SectionHeader title="Reports" subtitle="Generate and export platform analytics reports" />

      <div className="reports-grid">
        {reportCards.map((report, i) => {
          const IconComponent = ICON_MAP[report.icon] || FileText;
          return (
            <div
              key={report.id}
              className="admin-card report-card"
              style={{ '--card-delay': `${i * 60}ms` }}
            >
              <div className="report-card-header">
                <div className="card-icon-lg" style={{ background: report.gradient }}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <h3 className="report-card-title">{report.title}</h3>
                  <p className="report-card-desc">{report.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="report-stats">
                {Object.entries(report.stats).map(([key, val]) => (
                  <div key={key} className="report-stat-item">
                    <div className="report-stat-value">
                      {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
                    </div>
                    <div className="report-stat-label">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Buttons */}
              <div className="report-export-row">
                {exportFormats.map((fmt) => {
                  const FmtIcon = FMT_ICONS[fmt.icon] || FileText;
                  return (
                    <button
                      key={fmt.id}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleExport(report.id, fmt.id)}
                    >
                      <FmtIcon size={13} /> {fmt.label.split(' ')[1]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <CustomDialog
        {...dialogConfig}
        onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default Reports;
