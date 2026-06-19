import React, { useState } from 'react';
import { Eye, Download, RefreshCw, QrCode } from 'lucide-react';
import SectionHeader from '../../components/SectionHeader/SectionHeader.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Badge from '../../components/Badge/Badge.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import { certificates } from '../../data/certificates.js';
import '../../styles/table.css';
import '../../styles/forms.css';
import './Certificates.css';

const ITEMS_PER_PAGE = 10;

function Certificates() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCert, setViewCert] = useState(null);

  const filtered = certificates.filter((c) =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="admin-page-content">
      <SectionHeader title="Certificates" subtitle="Manage and issue course completion certificates" />

      <div className="admin-table-wrapper">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <SearchBar
              value={search}
              onChange={(v) => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search certificates..."
            />
          </div>
        </div>

        {paginated.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>QR Code</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id}>
                  <td className="table-mono">{c.id}</td>
                  <td>
                    <div className="table-user-info">
                      <span className="table-user-name">{c.studentName}</span>
                      <span className="table-user-email">{c.studentEmail}</span>
                    </div>
                  </td>
                  <td>{c.course}</td>
                  <td>
                    {c.issueDate
                      ? new Date(c.issueDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td><Badge variant={c.status} dot>{c.status}</Badge></td>
                  <td>
                    {c.verificationCode ? (
                      <span className="cert-qr-cell">
                        <QrCode size={13} /> {c.verificationCode}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="col-actions">
                    <div className="table-actions">
                      {c.status === 'pending' && (
                        <button className="table-action-btn success" title="Generate">
                          <RefreshCw size={13} />
                        </button>
                      )}
                      {c.status === 'issued' && (
                        <button className="table-action-btn" title="Download">
                          <Download size={13} />
                        </button>
                      )}
                      <button className="table-action-btn" title="View" onClick={() => setViewCert(c)}>
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No certificates found" />
        )}

        <div className="table-footer">
          <span className="table-footer-info">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <Modal isOpen={!!viewCert} onClose={() => setViewCert(null)} title="Certificate Details" size="md">
        {viewCert && (
          <div className="cert-modal-body">
            <div className="cert-modal-icon">
              <QrCode size={34} />
            </div>
            <h2 className="cert-modal-id">{viewCert.id}</h2>
            <p className="cert-modal-subtitle">{viewCert.studentName} — {viewCert.course}</p>

            <div className="cert-detail-block">
              <div className="cert-detail-item">
                <span className="cert-detail-label">Status</span>
                <Badge variant={viewCert.status} dot>{viewCert.status}</Badge>
              </div>
              <div className="cert-detail-item">
                <span className="cert-detail-label">Issue Date</span>
                <span className="cert-detail-value">{viewCert.issueDate || 'Not issued'}</span>
              </div>
              <div className="cert-detail-item">
                <span className="cert-detail-label">Verification</span>
                <span className="cert-detail-value">{viewCert.verificationCode || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Certificates;
